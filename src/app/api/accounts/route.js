import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import dbConnect from "@/lib/dbConnect";
import Account from "@/models/Account";

/**
 * ==============================================================================
 * GET /api/accounts
 * Hỗ trợ:
 *  - Phân trang (Pagination): ?page=1&limit=12 (Mặc định 12 tài khoản / trang)
 *  - Lọc theo Rank: ?rank=Thần Thoại
 *  - Lọc theo Trạng thái: ?status=Còn hàng
 * ==============================================================================
 */
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const rank = searchParams.get("rank");
    const collectionTier = searchParams.get("collectionTier") || searchParams.get("tier");
    const status = searchParams.get("status");

    // Xử lý tham số phân trang
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "12", 10));
    const skip = (page - 1) * limit;

    // Xây dựng điều kiện lọc
    const filter = {};

    // Lọc theo Điểm Sưu Tập (hoặc Rank tương đương nếu tài khoản cũ chưa lưu tier)
    if (collectionTier && collectionTier !== "ALL") {
      filter.$or = [
        { collectionTier: collectionTier },
        ...(collectionTier === "Sưu tập thiên hà" ? [{ rank: "Chí Tôn" }] : []),
        ...(collectionTier === "Nhà đại sưu tập" ? [{ rank: "Vinh Quang Thần Thoại" }] : []),
        ...(collectionTier === "Sưu tập siêu cấp" ? [{ rank: "Thần Thoại" }] : []),
        ...(collectionTier === "Sưu tập truyền kỳ" ? [{ rank: { $in: ["Huyền Thoại", "Sử Thi"] } }] : []),
      ];
    } else if (rank && rank !== "ALL") {
      filter.rank = rank;
    }

    // Mặc định ẩn các tài khoản đã bán, chỉ hiển thị tài khoản "Còn hàng"
    // Trừ khi truyền status=ALL (dành cho Admin quản trị xem toàn bộ kho)
    if (status === "ALL") {
      // Không lọc theo status
    } else if (status) {
      filter.status = status;
    } else {
      filter.status = "Còn hàng";
    }

    // Thực hiện song song đếm tổng số bản ghi và truy vấn trang hiện tại
    const [total, accounts] = await Promise.all([
      Account.countDocuments(filter),
      Account.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json(
      {
        success: true,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        filterApplied: {
          rank: rank || "Tất cả",
          status: status || "Tất cả",
        },
        data: accounts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi GET /api/accounts:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Không thể lấy danh sách tài khoản từ cơ sở dữ liệu",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * ==============================================================================
 * POST /api/accounts
 * Thêm tài khoản mới vào MongoDB
 * ==============================================================================
 */
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const { id, title, price, rank } = body;
    if (!id || !title || price === undefined || !rank) {
      return NextResponse.json(
        {
          success: false,
          message: "Vui lòng cung cấp đầy đủ các trường bắt buộc: id, title, price, rank.",
        },
        { status: 400 }
      );
    }

    const newAccount = await Account.create(body);

    // Tự động làm mới cache trang chủ và các danh mục ngay lập tức (On-Demand ISR Revalidation)
    try {
      revalidatePath("/");
      revalidatePath("/acc-vip");
      revalidatePath("/acc-sinh-vien");
      revalidateTag("accounts");
    } catch (revalErr) {
      console.warn("Revalidate cache warning:", revalErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Tạo tài khoản #${newAccount.id} thành công!`,
        data: newAccount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi POST /api/accounts:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: `Mã tài khoản ID '${error.keyValue?.id || ""}' đã tồn tại trong hệ thống. Vui lòng chọn mã khác!`,
        },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu không hợp lệ theo quy định hệ thống",
          errors: messages,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Lỗi máy chủ khi tạo tài khoản",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
