import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Account from "@/models/Account";
import { mockAccounts } from "@/data/mockAccounts";

// GET /api/seed: Tự động nạp 8 tài khoản mẫu vào MongoDB để test
export async function GET() {
  try {
    await dbConnect();

    // Xóa dữ liệu cũ (nếu có) để tránh trùng ID
    await Account.deleteMany({});

    // Thêm 8 tài khoản mẫu
    const inserted = await Account.insertMany(mockAccounts);

    return NextResponse.json({
      success: true,
      message: `Đã nạp thành công ${inserted.length} tài khoản vào cơ sở dữ liệu MongoDB!`,
      data: inserted,
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
