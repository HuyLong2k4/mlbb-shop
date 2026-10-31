import dbConnect from "@/lib/dbConnect";
import Account from "@/models/Account";
import { deleteMultipleFromCloudinary } from "@/lib/cloudinary";
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
 * ==============================================================================
 */

/**
 * Lấy số lượng và thống kê các tài khoản đã bán đủ điều kiện dọn dẹp ảnh (> 10 ngày)
 */
export async function getCleanupStats(daysThreshold = 10) {
  try {
    await dbConnect();

    const thresholdDate = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000);

    const [eligibleCount, totalSold, totalCleaned] = await Promise.all([
      Account.countDocuments({
        status: "Đã bán",
        soldAt: { $ne: null, $lte: thresholdDate },
        isImageCleaned: { $ne: true },
      }),
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
    const expiredAccounts = await Account.find({
      status: "Đã bán",
      soldAt: { $ne: null, $lte: thresholdDate },
      isImageCleaned: { $ne: true },
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

      // 3. Xóa các ảnh chi tiết trên Cloudinary (có await chống freeze serverless)
      if (imagesToDelete.length > 0) {
        try {
          await deleteMultipleFromCloudinary(imagesToDelete);
          totalDeletedImages += imagesToDelete.length;
          console.log(
            `[Lifecycle Cleanup] Đã xóa ${imagesToDelete.length} ảnh chi tiết của acc #${account.id} khỏi Cloudinary.`
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
        },
      });

      cleanedAccountsInfo.push({
        id: account.id,
        deletedCount: imagesToDelete.length,
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
      message: `Đã dọn dẹp thành công ${expiredAccounts.length} tài khoản đã bán quá 10 ngày (Đã xóa vĩnh viễn ${totalDeletedImages} ảnh rác trên Cloudinary).`,
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
