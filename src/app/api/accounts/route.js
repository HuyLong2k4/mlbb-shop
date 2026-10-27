import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import dbConnect from "@/lib/dbConnect";
import Account from "@/models/Account";
import { verifyAdminSession } from "@/lib/serverAuth";

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

    // Xử lý tham số phân trang an toàn (chống lỗi NaN Injection làm sập MongoDB và giới hạn tối đa 100/trang)
    const rawPage = parseInt(searchParams.get("page") || "1", 10);
    const rawLimit = parseInt(searchParams.get("limit") || "12", 10);
    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
    const limit = Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 100) : 12;
    const skip = (page - 1) * limit;

    // Xây dựng điều kiện lọc
    const filter = {};

    // Lọc theo Điểm Sưu Tập
    if (collectionTier && collectionTier !== "ALL") {
      filter.collectionTier = collectionTier;
    } else if (rank && rank !== "ALL") {
      filter.rank = rank;
    }

    // Lọc theo trạng thái:
    // Nếu status="ALL" hoặc không truyền status, sẽ lấy tất cả trạng thái (cả Còn hàng và Đã bán/Hết hàng)
    // Nếu truyền status cụ thể (ví dụ: status=Còn hàng), chỉ lọc theo trạng thái đó
    if (status && status !== "ALL") {
      filter.status = status;
    }

    // Thực hiện song song đếm tổng số bản ghi và truy vấn trang hiện tại
    // Áp dụng Aggregation Pipeline để tối ưu sắp xếp 2 tầng:
    // Tầng 1: Ưu tiên 'Còn hàng' (priority 0) lên đầu, các trạng thái khác ('Đã bán', 'Hết hàng' - priority 1) xuống cuối
    // Tầng 2: Trong cùng một nhóm, sắp xếp createdAt giảm dần (-1, mới nhất lên trước)
    const [total, accounts] = await Promise.all([
      Account.countDocuments(filter),
      Account.aggregate([
        { $match: filter },
        {
          $addFields: {
            statusPriority: {
              $cond: {
                if: { $eq: ["$status", "Còn hàng"] },
                then: 0,
                else: 1,
              },
            },
          },
        },
        {
          $sort: {
            statusPriority: 1,
            createdAt: -1,
          },
        },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            statusPriority: 0,
          },
        },
      ]),
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
  // 1. CHẶN TRUY CẬP TRÁI PHÉP: Bắt buộc phải đăng nhập quyền Admin mới được tạo tài khoản
  const authError = await verifyAdminSession();
  if (authError) return authError;

  try {
    await dbConnect();
    const body = await request.json();

    const { id, title, price } = body;
    if (!id || !title || price === undefined || price === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Vui lòng cung cấp đầy đủ các trường bắt buộc: id, title, price.",
        },
        { status: 400 }
      );
    }

    // Chuẩn hóa và kiểm tra tính hợp lệ của mã tài khoản ID
    body.id = String(id).trim().toUpperCase();

    // Kiểm tra tính hợp lệ của giá bán (chống giá âm hoặc chuỗi không phải số)
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Giá bán không hợp lệ (phải là số và không được nhỏ hơn 0 VNĐ).",
        },
        { status: 400 }
      );
    }
    body.price = numPrice;

    // Chuẩn hóa giá gốc niêm yết
    if (body.originalPrice !== undefined && body.originalPrice !== null && body.originalPrice !== "") {
      const numOriginal = Number(body.originalPrice);
      if (isNaN(numOriginal) || numOriginal < 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Giá niêm yết (giá gốc) không hợp lệ.",
          },
          { status: 400 }
        );
      }
      body.originalPrice = numOriginal;
    } else {
      body.originalPrice = null;
    }

    // Chuẩn hóa highlightSkins từ chuỗi sang mảng nếu cần
    if (typeof body.highlightSkins === "string") {
      body.highlightSkins = body.highlightSkins
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // Tự động đồng bộ screenshots từ mảng images nếu chưa có
    if (Array.isArray(body.images) && (!body.screenshots || body.screenshots.length === 0)) {
      body.screenshots = body.images.map((url, idx) => ({
        id: idx + 1,
        title: `Ảnh in-game #${idx + 1}`,
        caption: `Chi tiết tài khoản #${body.id}`,
        imageUrl: url,
      }));
    }

    if (!body.rank) {
      body.rank = "Thần Thoại";
    }

    const newAccount = await Account.create(body);

    // Tự động làm mới cache trang chủ và các danh mục ngay lập tức (On-Demand ISR Revalidation)
    try {
      revalidatePath("/", "layout");
      revalidatePath("/", "page");
      revalidatePath("/acc-vip", "page");
      revalidatePath("/acc-sinh-vien", "page");
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
