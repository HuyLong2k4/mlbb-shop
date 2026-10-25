import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Có thể bổ sung kiểm tra quyền (role) tại đây nếu cần
    const token = req.nextauth.token;
    // Nếu route yêu cầu admin nhưng role không phải admin
    if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "admin") {
      // Cho phép nếu là admin hoặc chuyển hướng nếu cần
      return NextResponse.next();
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      // Chỉ cho phép truy cập nếu có JWT token (đã đăng nhập)
      authorized: ({ token }) => !!token,
    },
    pages: {
      // Chuyển hướng người chưa đăng nhập về trang đăng nhập
      signIn: "/auth/login",
    },
  }
);

// Cấu hình các route được bảo vệ
export const config = {
  matcher: [
    "/admin",
    "/admin/:path*", // Bảo vệ tất cả các trang con trong /admin
  ],
};
