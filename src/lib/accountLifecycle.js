import dbConnect from "@/lib/dbConnect";
import Account from "@/models/Account";
import cloudinary, {
  deleteMultipleFromCloudinary,
  getPublicIdFromUrl,
} from "@/lib/cloudinary";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * ==============================================================================
 * MODULE QUẢN LÝ VÒNG ĐỜI TÀI KHOẢN (ACCOUNT LIFECYCLE MANAGEMENT)
 * ==============================================================================
 * Cơ chế:
 * 1. Khi một acc chuyển sang trạng thái "Đã bán", hệ thống ghi nhận thời điểm `soldAt`.
 * 2. Sau số ngày chỉ định (mặc định 10 ngày - hết chu kỳ bảo hành):
 *    - Tự động gọi API Cloudinary xóa toàn bộ 9–10 ảnh chi tiết (screenshots in-game).
 *    - Chỉ giữ lại đúng 1 ảnh thumbnail đại diện đầu tiên để làm bằng chứng lịch sử giao dịch.
 *    - Đánh dấu `isImageCleaned = true` để không xóa lại.
 * 3. Hỗ trợ quét và xóa ảnh mồ côi (Orphaned images) không còn thuộc tài khoản nào.
 * ==============================================================================
 */

/**
 * Lấy số lượng và thống kê các tài khoản đã bán đủ điều kiện dọn dẹp ảnh (> 10 ngày)
 */
export async function getCleanupStats(daysThreshold = 10) {
  try {
    await dbConnect();

    const thresholdDate = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000);

    const eligibleQuery = {
      status: "Đã bán",
      isImageCleaned: { $ne: true },
      $or: [
        { soldAt: { $ne: null, $lte: thresholdDate } },
        { soldAt: null, updatedAt: { $lte: thresholdDate } },
        { soldAt: null, createdAt: { $lte: thresholdDate } },
      ],
    };

    const [eligibleCount, totalSold, totalCleaned] = await Promise.all([
      Account.countDocuments(eligibleQuery),
      Account.countDocuments({ status: "Đã bán" }),
      Account.countDocuments({ status: "Đã bán", isImageCleaned: true }),
    ]);

    return {
      eligibleCount,
      totalSold,
      totalCleaned,
      daysThreshold,
    };
  } catch (error) {
    console.error("Lỗi getCleanupStats:", error);
    return {
      eligibleCount: 0,
      totalSold: 0,
      totalCleaned: 0,
      daysThreshold,
      error: error.message,
    };
  }
}

/**
 * Thực thi dọn dẹp ảnh các tài khoản đã bán sau 10 ngày
 * @param {number} daysThreshold - Số ngày tối thiểu sau khi bán (Mặc định: 10 ngày)
 */
export async function cleanupExpiredSoldAccounts(daysThreshold = 10) {
  try {
    await dbConnect();

    const thresholdDate = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000);

    // 1. Tìm các tài khoản đã bán từ 10 ngày trước và chưa được dọn dẹp ảnh
    // Hỗ trợ dự phòng (fallback): nếu soldAt bị null, lấy updatedAt hoặc createdAt làm mốc
    const expiredAccounts = await Account.find({
      status: "Đã bán",
      isImageCleaned: { $ne: true },
      $or: [
        { soldAt: { $ne: null, $lte: thresholdDate } },
        { soldAt: null, updatedAt: { $lte: thresholdDate } },
        { soldAt: null, createdAt: { $lte: thresholdDate } },
      ],
    });

    if (!expiredAccounts || expiredAccounts.length === 0) {
      return {
        success: true,
        message: "Không có tài khoản đã bán nào đủ điều kiện dọn dẹp (> 10 ngày).",
        cleanedAccountsCount: 0,
        deletedImagesCount: 0,
        cleanedAccounts: [],
      };
    }

    let totalDeletedImages = 0;
    const cleanedAccountsInfo = [];

    // 2. Xử lý từng tài khoản
    for (const account of expiredAccounts) {
      // Xác định 1 ảnh thumbnail duy nhất cần giữ lại (ưu tiên ảnh đầu tiên trong mảng images hoặc screenshot đầu tiên)
      const keepUrl =
        account.images?.[0] || account.screenshots?.[0]?.imageUrl || "";

      // Thu thập tất cả các ảnh còn lại cần xóa khỏi Cloudinary
      const allUrls = new Set([
        ...(Array.isArray(account.images) ? account.images : []),
        ...(Array.isArray(account.screenshots)
          ? account.screenshots.map((s) => s.imageUrl).filter(Boolean)
          : []),
      ]);

      const imagesToDelete = Array.from(allUrls).filter(
        (url) => url && url !== keepUrl
      );

      let actuallyDeleted = 0;

      // 3. Xóa các ảnh chi tiết trên Cloudinary (có await chống freeze serverless)
      if (imagesToDelete.length > 0) {
        try {
          const deleteResults = await deleteMultipleFromCloudinary(imagesToDelete);
          actuallyDeleted = deleteResults.filter(
            (r) =>
              r.status === "fulfilled" &&
              (r.value?.result === "ok" || r.value?.result === "not found")
          ).length;
          totalDeletedImages += actuallyDeleted;
          console.log(
            `[Lifecycle Cleanup] Đã xóa ${actuallyDeleted}/${imagesToDelete.length} ảnh chi tiết của acc #${account.id} khỏi Cloudinary.`
          );
        } catch (cleanErr) {
          console.warn(
            `[Lifecycle Cleanup Warning] Lỗi xóa ảnh Cloudinary cho acc #${account.id}:`,
            cleanErr.message
          );
        }
      }

      // 4. Cập nhật tài khoản trong MongoDB: chỉ lưu 1 ảnh đại diện, xóa dải screenshots thừa
      await Account.findByIdAndUpdate(account._id, {
        $set: {
          images: keepUrl ? [keepUrl] : [],
          screenshots: keepUrl
            ? [
                {
                  id: 1,
                  title: "Ảnh đại diện (Đã bán)",
                  caption: `Tài khoản #${account.id} đã hoàn tất giao dịch thành công.`,
                  imageUrl: keepUrl,
                },
              ]
            : [],
          isImageCleaned: true,
          cleanedImagesAt: new Date(),
          // Nếu trước đó chưa có soldAt thì cập nhật luôn
          soldAt: account.soldAt || account.updatedAt || account.createdAt || new Date(),
        },
      });

      cleanedAccountsInfo.push({
        id: account.id,
        deletedCount: actuallyDeleted,
        keptThumbnail: !!keepUrl,
      });
    }

    // 5. Invalidate cache Next.js để trang chủ và chi tiết cập nhật ngay
    try {
      revalidatePath("/", "layout");
      revalidatePath("/", "page");
      revalidatePath("/admin", "page");
      revalidateTag("accounts");
    } catch (revalErr) {
      console.warn("[Lifecycle Cleanup] Revalidate warning:", revalErr.message);
    }

    return {
      success: true,
      message: `Đã dọn dẹp thành công ${expiredAccounts.length} tài khoản đã bán quá 10 ngày (Đã xóa vĩnh viễn ${totalDeletedImages} ảnh trên Cloudinary).`,
      cleanedAccountsCount: expiredAccounts.length,
      deletedImagesCount: totalDeletedImages,
      cleanedAccounts: cleanedAccountsInfo,
    };
  } catch (error) {
    console.error("Lỗi thực thi cleanupExpiredSoldAccounts:", error);
    return {
      success: false,
      message: "Lỗi hệ thống khi dọn dẹp ảnh tài khoản đã bán.",
      error: error.message,
    };
  }
}

/**
 * ==============================================================================
 * DỌN DẸP ẢNH MỒ CÔI (ORPHANED IMAGES CLEANER)
 * ==============================================================================
 * Quét toàn bộ kho ảnh trên Cloudinary, đối chiếu với tất cả link ảnh đang dùng
 * trong MongoDB (tất cả tài khoản). Bất kỳ ảnh nào trên Cloudinary không còn nằm
 * trong database sẽ được xóa vĩnh viễn để giải phóng dung lượng.
 * ==============================================================================
 */
export async function cleanupOrphanedCloudinaryImages() {
  try {
    await dbConnect();

    // 1. Lấy toàn bộ link ảnh hợp lệ đang được sử dụng trong MongoDB
    const accounts = await Account.find({}).select("images screenshots").lean();

    const activePublicIds = new Set();
    accounts.forEach((acc) => {
      if (Array.isArray(acc.images)) {
        acc.images.forEach((url) => {
          const pid = getPublicIdFromUrl(url);
          if (pid) activePublicIds.add(pid);
        });
      }
      if (Array.isArray(acc.screenshots)) {
        acc.screenshots.forEach((s) => {
          const pid = getPublicIdFromUrl(s.imageUrl);
          if (pid) activePublicIds.add(pid);
        });
      }
    });

    console.log(
      `[Orphan Cleanup] Đang có ${activePublicIds.size} ảnh active trong MongoDB.`
    );

    // 2. Lấy danh sách ảnh trên Cloudinary qua API Resources
    let nextCursor = null;
    let allCloudinaryImages = [];

    do {
      const options = {
        resource_type: "image",
        type: "upload",
        max_results: 500,
      };
      if (nextCursor) options.next_cursor = nextCursor;

      const res = await cloudinary.api.resources(options);
      if (Array.isArray(res.resources)) {
        allCloudinaryImages.push(...res.resources);
      }
      nextCursor = res.next_cursor;
    } while (nextCursor);

    console.log(
      `[Orphan Cleanup] Tổng số ảnh tìm thấy trên Cloudinary: ${allCloudinaryImages.length}.`
    );

    // 3. Lọc ra các ảnh mồ côi (không nằm trong activePublicIds và không phải logo/hệ thống)
    const orphanedPublicIds = [];
    for (const item of allCloudinaryImages) {
      const pid = item.public_id;
      // Bỏ qua ảnh logo, favicon nếu có trên Cloudinary
      if (
        pid.startsWith("logo") ||
        pid.startsWith("banner") ||
        pid.startsWith("system/")
      ) {
        continue;
      }

      if (!activePublicIds.has(pid)) {
        orphanedPublicIds.push(pid);
      }
    }

    console.log(
      `[Orphan Cleanup] Phát hiện ${orphanedPublicIds.length} ảnh mồ côi cần xóa trên Cloudinary.`
    );

    if (orphanedPublicIds.length === 0) {
      return {
        success: true,
        message:
          "Kho ảnh Cloudinary hoàn toàn đồng bộ với Database, không có ảnh rác mồ côi.",
        totalCloudinaryImages: allCloudinaryImages.length,
        activeImagesInDb: activePublicIds.size,
        deletedOrphanedCount: 0,
      };
    }

    // 4. Xóa các ảnh mồ côi theo từng batch tối đa 100 ảnh / lần (giới hạn của Cloudinary API delete_resources)
    let totalDeleted = 0;
    const batchSize = 100;

    for (let i = 0; i < orphanedPublicIds.length; i += batchSize) {
      const batch = orphanedPublicIds.slice(i, i + batchSize);
      try {
        const deleteRes = await cloudinary.api.delete_resources(batch, {
          all: true,
          invalidate: true,
        });

        if (deleteRes?.deleted) {
          const okCount = Object.values(deleteRes.deleted).filter(
            (status) => status === "deleted" || status === "not_found"
          ).length;
          totalDeleted += okCount;
        }
      } catch (delErr) {
        console.warn("[Orphan Cleanup] Lỗi batch xóa:", delErr.message);
        // Fallback: xóa lẻ từng file
        for (const pid of batch) {
          try {
            await cloudinary.uploader.destroy(pid, { invalidate: true });
            totalDeleted++;
          } catch {}
        }
      }
    }

    return {
      success: true,
      message: `Đã dọn dẹp thành công ${totalDeleted} ảnh rác mồ côi trên Cloudinary!`,
      totalCloudinaryImages: allCloudinaryImages.length,
      activeImagesInDb: activePublicIds.size,
      deletedOrphanedCount: totalDeleted,
    };
  } catch (error) {
    console.error("Lỗi cleanupOrphanedCloudinaryImages:", error);
    return {
      success: false,
      message: "Lỗi khi quét dọn ảnh mồ côi trên Cloudinary: " + error.message,
      error: error.message,
    };
  }
}
