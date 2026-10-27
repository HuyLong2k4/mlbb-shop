import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Middleware bảo vệ phía Server cho các API thay đổi dữ liệu (POST, PUT, PATCH, DELETE).
 * - Trả về null nếu người dùng đã đăng nhập với vai trò 'admin'.
 * - Trả về NextResponse 401 (chưa đăng nhập) hoặc 403 (không đủ quyền) nếu không hợp lệ.
 */
export async function verifyAdminSession(): Promise<NextResponse | null> {
  try {
    const session: any = await getServerSession(authOptions as any);

    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Yêu cầu xác thực: Bạn cần đăng nhập tài khoản Quản trị (Admin) để thực hiện thao tác này.",
        },
        { status: 401 }
      );
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Từ chối quyền truy cập (403 Forbidden): Thao tác này chỉ dành riêng cho Quản trị viên hệ thống.",
        },
        { status: 403 }
      );
    }

    // Đã xác thực thành công vai trò Admin
    return null;
  } catch (error: any) {
    console.error("Lỗi xác thực verifyAdminSession:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi hệ thống khi xác thực quyền truy cập Quản trị.",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
