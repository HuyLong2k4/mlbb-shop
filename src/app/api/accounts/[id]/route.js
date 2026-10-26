import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { revalidatePath, revalidateTag } from "next/cache";
import dbConnect from "@/lib/dbConnect";
import Account from "@/models/Account";

/**
 * GET /api/accounts/[id]
 * Lấy chi tiết tài khoản theo mã ID từ MongoDB
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Mã tài khoản không hợp lệ" },
        { status: 400 }
      );
    }

    let normalizedId = String(id).trim();
    try {
      normalizedId = decodeURIComponent(normalizedId).trim();
    } catch {
      // Giữ nguyên nếu không giải mã được
    }

    // 1. Kết nối cơ sở dữ liệu MongoDB
    try {
      await dbConnect();
    } catch (dbErr) {
      console.warn("Cảnh báo dbConnect:", dbErr.message);
    }

    // 2. Tìm tài khoản trong MongoDB (hỗ trợ tìm chính xác, chữ hoa, chữ thường, ObjectId)
    let account = null;
    try {
      const orConditions = [
        { id: normalizedId },
        { id: normalizedId.toUpperCase() },
        { id: normalizedId.toLowerCase() },
      ];

      // Regex an toàn chống ký tự đặc biệt
      try {
        const escaped = normalizedId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        orConditions.push({ id: new RegExp(`^${escaped}$`, "i") });
      } catch {}

      // Tìm theo _id nếu là MongoDB ObjectId hợp lệ
      if (mongoose.Types.ObjectId.isValid(normalizedId)) {
        orConditions.push({ _id: new mongoose.Types.ObjectId(normalizedId) });
      }

      account = await Account.findOne({ $or: orConditions }).lean();
    } catch (queryErr) {
      console.warn("Lỗi truy vấn MongoDB Account.findOne:", queryErr.message);
    }

    // 3. Nếu không tìm thấy tài khoản trong MongoDB
    if (!account) {
      return NextResponse.json(
        {
          success: false,
          message: `Không tìm thấy tài khoản #${normalizedId}`,
        },
        { status: 404 }
      );
    }

    // 5. Chuẩn hóa dữ liệu ảnh chụp màn hình (screenshots & images)
    if ((!account.screenshots || account.screenshots.length === 0) && account.images?.length > 0) {
      account.screenshots = account.images.map((url, idx) => ({
        id: idx + 1,
        title: `Ảnh in-game #${idx + 1}`,
        caption: `Chi tiết tài khoản #${account.id}`,
        imageUrl: url,
      }));
    }

    // Nếu có screenshots mà chưa có images thì đồng bộ images
    if ((!account.images || account.images.length === 0) && account.screenshots?.length > 0) {
      account.images = account.screenshots.map((s) => s.imageUrl).filter(Boolean);
    }

    // Chuẩn hóa các trường bổ sung
    account.highlightSkins = Array.isArray(account.highlightSkins) ? account.highlightSkins : [];
    account.emblems =
      typeof account.emblems === "string"
        ? account.emblems
        : Array.isArray(account.emblems) && account.emblems.length > 0
        ? account.emblems.some((e) =>
            String(e).toLowerCase().includes("gần full") ||
            String(e).includes("55") ||
            String(e).includes("52") ||
            String(e).includes("48")
          )
          ? "Gần Full"
          : "Full"
        : "Full";
    account.reputationScore = account.reputationScore ?? 100;
    account.securityInfo = account.securityInfo || "100% Trắng Thông Tin (Chính chủ)";
    account.winRate = account.winRate || {
      overall: "55.0%",
      totalMatches: 1000,
      rankWinRate: "55.0%",
    };

    return NextResponse.json({
      success: true,
      data: account,
    });
  } catch (error) {
    console.error("Lỗi GET /api/accounts/[id]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi máy chủ khi lấy chi tiết tài khoản",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/accounts/[id]
 * Cập nhật một phần tài khoản (ví dụ: thay đổi trạng thái Còn hàng / Đã bán)
 */
export async function PATCH(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Mã tài khoản không hợp lệ" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Chỉ cho phép cập nhật các trường an toàn
    const allowedFields = ["status", "price", "originalPrice", "collectionTier", "description"];
    const updatePayload = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updatePayload[key] = body[key];
      }
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json(
        { success: false, message: "Không có dữ liệu hợp lệ để cập nhật" },
        { status: 400 }
      );
    }

    const normalizedId = decodeURIComponent(String(id).trim());

    const updatedAccount = await Account.findOneAndUpdate(
      {
        $or: [
          { id: normalizedId },
          { id: normalizedId.toUpperCase() },
          { id: normalizedId.toLowerCase() },
        ],
      },
      { $set: updatePayload },
      { new: true, runValidators: false }
    ).lean();

    if (!updatedAccount) {
      return NextResponse.json(
        { success: false, message: `Không tìm thấy tài khoản #${normalizedId}` },
        { status: 404 }
      );
    }

    // Xóa cache trang chủ ngay sau khi cập nhật trạng thái
    try {
      revalidatePath("/");
      revalidatePath("/acc-vip");
      revalidatePath("/acc-sinh-vien");
      revalidateTag("accounts");
    } catch (revalErr) {
      console.warn("Revalidate warning:", revalErr);
    }

    return NextResponse.json({
      success: true,
      message: `Cập nhật tài khoản #${updatedAccount.id} thành công!`,
      data: updatedAccount,
    });
  } catch (error) {
    console.error("Lỗi PATCH /api/accounts/[id]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi máy chủ khi cập nhật tài khoản",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/accounts/[id]
 * Cập nhật toàn diện thông tin tài khoản bằng findByIdAndUpdate
 * Hỗ trợ nhận _id từ body hoặc URL params
 * Tự động phát hiện ảnh cũ bị xóa để dọn dẹp trên Cloudinary
 */
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await request.json();

    // 1. Xác định _id của tài khoản trong MongoDB
    let targetObjectId = null;
    if (body._id && mongoose.Types.ObjectId.isValid(body._id)) {
      targetObjectId = body._id;
    } else if (id && mongoose.Types.ObjectId.isValid(id)) {
      targetObjectId = id;
    } else if (id) {
      // Nếu id trên URL là mã acc (ví dụ: MLBB-VIP-001), tìm doc để lấy _id
      const existing = await Account.findOne({
        $or: [{ id: id }, { id: id.toUpperCase() }, { id: id.toLowerCase() }],
      }).select("_id images screenshots");
      if (existing) {
        targetObjectId = existing._id;
      }
    }

    if (!targetObjectId) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy _id hợp lệ của tài khoản để cập nhật." },
        { status: 400 }
      );
    }

    // 2. Lấy dữ liệu cũ trước khi update để so sánh dọn dẹp ảnh Cloudinary
    const oldAccount = await Account.findById(targetObjectId).lean();
    if (!oldAccount) {
      return NextResponse.json(
        { success: false, message: "Tài khoản không tồn tại trong hệ thống." },
        { status: 404 }
      );
    }

    // 3. Chuẩn bị dữ liệu cập nhật
    const updateData = {};

    if (body.title !== undefined) updateData.title = String(body.title).trim();
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.originalPrice !== undefined) {
      updateData.originalPrice = body.originalPrice === "" ? null : Number(body.originalPrice);
    }
    if (body.collectionTier !== undefined) updateData.collectionTier = body.collectionTier;
    if (body.heroCount !== undefined) updateData.heroCount = Number(body.heroCount) || 0;
    if (body.skinCount !== undefined) updateData.skinCount = Number(body.skinCount) || 0;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.emblems !== undefined) updateData.emblems = body.emblems;
    if (body.description !== undefined) updateData.description = String(body.description).trim();

    // Chuẩn hóa highlightSkins (từ chuỗi sang mảng hoặc giữ mảng)
    if (body.highlightSkins !== undefined) {
      if (typeof body.highlightSkins === "string") {
        updateData.highlightSkins = body.highlightSkins
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else if (Array.isArray(body.highlightSkins)) {
        updateData.highlightSkins = body.highlightSkins.map((s) => String(s).trim()).filter(Boolean);
      }
    }

    // Cập nhật danh sách ảnh (images & screenshots)
    if (Array.isArray(body.images)) {
      updateData.images = body.images;
      updateData.screenshots = body.images.map((url, idx) => ({
        id: idx + 1,
        title: `Ảnh in-game #${idx + 1}`,
        caption: `Chi tiết tài khoản #${oldAccount.id}`,
        imageUrl: url,
      }));
    }

    // 4. Thực thi findByIdAndUpdate để lưu dữ liệu mới vào MongoDB
    const updatedAccount = await Account.findByIdAndUpdate(
      targetObjectId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    // 5. Tự động dọn dẹp ảnh cũ trên Cloudinary (nếu có ảnh bị xóa khỏi danh sách)
    if (Array.isArray(body.images) && Array.isArray(oldAccount.images)) {
      const newImagesSet = new Set(body.images);
      const deletedImages = oldAccount.images.filter((oldUrl) => !newImagesSet.has(oldUrl));

      if (deletedImages.length > 0) {
        try {
          const { deleteMultipleFromCloudinary } = await import("@/lib/cloudinary");
          deleteMultipleFromCloudinary(deletedImages);
          console.log(`[Cloudinary Cleanup] Đã gửi lệnh xóa ${deletedImages.length} ảnh cũ.`);
        } catch (cleanErr) {
          console.warn("[Cloudinary Cleanup Warning] Không thể xóa ảnh cũ:", cleanErr.message);
        }
      }
    }

    // 6. Xóa cache On-demand ISR để trang chủ & trang chi tiết cập nhật tức thì
    try {
      revalidatePath("/");
      revalidatePath(`/acc/${updatedAccount.id}`);
      revalidatePath("/admin");
      revalidateTag("accounts");
    } catch (revalErr) {
      console.warn("Revalidate warning:", revalErr);
    }

    return NextResponse.json({
      success: true,
      message: `Cập nhật tài khoản #${updatedAccount.id} thành công!`,
      data: updatedAccount,
    });
  } catch (error) {
    console.error("Lỗi PUT /api/accounts/[id]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi máy chủ khi cập nhật tài khoản.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
