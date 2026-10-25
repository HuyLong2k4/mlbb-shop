import { NextResponse } from "next/server";
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

    const normalizedId = decodeURIComponent(id).trim();

    // 1. Kết nối cơ sở dữ liệu MongoDB
    try {
      await dbConnect();
    } catch (dbErr) {
      console.warn("Lỗi kết nối MongoDB, chuyển sang kiểm tra mock data:", dbErr.message);
    }

    // 2. Tìm tài khoản trong MongoDB (hỗ trợ tìm chính xác hoặc không phân biệt hoa thường)
    let account = null;
    try {
      account = await Account.findOne({
        $or: [
          { id: normalizedId.toUpperCase() },
          { id: normalizedId },
          { id: new RegExp(`^${normalizedId}$`, "i") },
        ],
      }).lean();
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
    account.emblems = Array.isArray(account.emblems) ? account.emblems : [];
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
