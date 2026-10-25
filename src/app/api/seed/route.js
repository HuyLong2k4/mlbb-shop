import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Account from "@/models/Account";
import { mockAccounts } from "@/data/mockAccounts";

// GET /api/seed: Tự động nạp 8 tài khoản mẫu vào MongoDB để test
export async function GET() {
  try {
    await dbConnect();

    // Chỉ thêm các tài khoản mẫu nếu chưa tồn tại trong hệ thống (KHÔNG xóa tài khoản do Admin tự tạo)
    let addedCount = 0;
    for (const mock of mockAccounts) {
      const exists = await Account.findOne({ id: mock.id });
      if (!exists) {
        await Account.create(mock);
        addedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Đã nạp thêm ${addedCount} tài khoản mẫu (không làm mất tài khoản bạn tự tạo)!`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        tip: "Hãy kiểm tra lại biến MONGODB_URI trong file .env.local và đảm bảo đã cấp quyền IP trong MongoDB Atlas.",
      },
      { status: 500 }
    );
  }
}
