import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { revalidatePath, revalidateTag } from "next/cache";
import dbConnect from "@/lib/dbConnect";
import Account from "@/models/Account";
import { mockAccounts } from "@/data/mockAccounts";

/**
 * GET /api/accounts/[id]
 * Lấy chi tiết tài khoản theo mã ID từ MongoDB (hoặc mock data fallback)
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

    // 3. Nếu không có trong MongoDB, tìm trong mockAccounts làm fallback
    if (!account) {
      const mockAcc = mockAccounts.find(
        (acc) => acc.id.toLowerCase() === normalizedId.toLowerCase()
      );
      if (mockAcc) {
        account = { ...mockAcc };
      }
    }

    // 4. Nếu vẫn không tìm thấy
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
