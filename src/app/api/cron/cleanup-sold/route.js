import { NextResponse } from "next/server";
import {
  cleanupExpiredSoldAccounts,
  cleanupOrphanedCloudinaryImages,
  getCleanupStats,
} from "@/lib/accountLifecycle";
import { verifyAdminSession } from "@/lib/serverAuth";

/**
 * ==============================================================================
 * API /api/cron/cleanup-sold
 * Hỗ trợ cả GET & POST:
 * 1. GET: Dành cho Vercel Cron Job tự động chạy hàng ngày hoặc xem thống kê
 * 2. POST: Dành cho Admin bấm nút kích hoạt dọn dẹp trực tiếp trên trang Quản trị
 * ==============================================================================
 */

// Hàm kiểm tra quyền thực thi (Admin session hoặc Cron Secret)
async function authorizeRequest(request) {
  // 1. Kiểm tra Cron Secret qua Header Authorization hoặc Query param
  const authHeader = request.headers.get("authorization");
  const { searchParams } = new URL(request.url);
  const secretParam = searchParams.get("secret");

  const validSecret =
    process.env.CRON_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "mlbb_cron_secret_lifecycle_2026";

  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7).trim()
    : null;

  if (bearerToken === validSecret || secretParam === validSecret) {
    return null; // Xác thực thành công bằng Cron Secret
  }

  // 2. Nếu không có Cron Secret, kiểm tra phiên đăng nhập Admin
  const adminError = await verifyAdminSession();
  return adminError; // Trả về null nếu là Admin, hoặc NextResponse 401/403 nếu không hợp lệ
}

/**
 * GET /api/cron/cleanup-sold
 * Query params:
 *  - ?action=stats: Chỉ lấy thông tin số lượng acc cần dọn dẹp
 *  - ?action=orphans: Dọn dẹp riêng ảnh rác mồ côi
 *  - ?days=10: Số ngày sau khi bán (mặc định 10)
 */
export async function GET(request) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const rawDays = parseInt(searchParams.get("days") || "10", 10);
  const days = Number.isInteger(rawDays) && rawDays > 0 ? rawDays : 10;

  if (action === "stats") {
    const stats = await getCleanupStats(days);
    return NextResponse.json({ success: true, data: stats });
  }

  if (action === "orphans") {
    const orphanRes = await cleanupOrphanedCloudinaryImages();
    return NextResponse.json(orphanRes, {
      status: orphanRes.success ? 200 : 500,
    });
  }

  // Mặc định: Dọn dẹp cả acc đã bán > 10 ngày VÀ quét sạch ảnh rác mồ côi
  const expiredRes = await cleanupExpiredSoldAccounts(days);
  const orphanRes = await cleanupOrphanedCloudinaryImages();

  return NextResponse.json({
    success: expiredRes.success && orphanRes.success,
    message: `${expiredRes.message} Đồng thời: ${orphanRes.message}`,
    expiredAccounts: expiredRes,
    orphanedCleanup: orphanRes,
  });
}

/**
 * POST /api/cron/cleanup-sold
 * Kích hoạt dọn dẹp từ Admin Dashboard
 */
export async function POST(request) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  let days = 10;
  let action = "all";

  try {
    const body = await request.json();
    if (body?.days && Number.isInteger(Number(body.days))) {
      days = Math.max(1, Number(body.days));
    }
    if (body?.action) {
      action = body.action;
    }
  } catch {
    // Không có body thì dùng mặc định
  }

  if (action === "orphans") {
    const orphanRes = await cleanupOrphanedCloudinaryImages();
    return NextResponse.json(orphanRes, {
      status: orphanRes.success ? 200 : 500,
    });
  }

  // Dọn dẹp cả tài khoản đã bán > 10 ngày VÀ quét sạch toàn bộ ảnh mồ côi
  const expiredRes = await cleanupExpiredSoldAccounts(days);
  const orphanRes = await cleanupOrphanedCloudinaryImages();

  const totalImagesDeleted =
    (expiredRes.deletedImagesCount || 0) + (orphanRes.deletedOrphanedCount || 0);

  return NextResponse.json({
    success: expiredRes.success && orphanRes.success,
    message: `Đã dọn dẹp ${expiredRes.cleanedAccountsCount || 0} acc đã bán (>10 ngày) và xóa tổng cộng ${totalImagesDeleted} ảnh trên Cloudinary!`,
    totalImagesDeleted,
    expiredAccounts: expiredRes,
    orphanedCleanup: orphanRes,
  });
}
