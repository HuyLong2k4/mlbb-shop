import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cấu hình Cloudinary (Dùng biến môi trường nếu có, hoặc dùng fallback có sẵn)
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "daksfvybx";
const API_KEY = process.env.CLOUDINARY_API_KEY || "473819711181877";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "yGS_PcZrzSubqAqQ8G-k2HsMof5o";

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

/**
 * POST /api/upload
 * Tiếp nhận file ảnh từ Form (multipart/form-data)
 * Upload trực tiếp lên Cloudinary và trả về mảng URL ảnh an toàn (HTTPS)
 */
export async function POST(request) {
  try {
    // 1. Kiểm tra cấu hình Cloudinary
    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message: "Chưa cấu hình API Keys cho Cloudinary.",
        },
        { status: 500 }
      );
    }

    // 2. Đọc formData từ request
    const formData = await request.formData();
    // Lấy danh sách các files (hỗ trợ cả 'files' và 'file')
    const files = formData.getAll("files").concat(formData.getAll("file"));

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy file ảnh nào được gửi lên." },
        { status: 400 }
      );
    }

    const uploadPromises = [];

    // 3. Xử lý từng file ảnh và đẩy lên Cloudinary
    for (const file of files) {
      if (!(file instanceof File)) continue;

      // Chuyển file sang Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload qua Cloudinary upload_stream
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "mlbb_accounts",
            resource_type: "image",
            transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
          },
          (error, result) => {
            if (error) {
              console.error("Lỗi upload Cloudinary:", error);
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                name: file.name,
              });
            }
          }
        );

        uploadStream.end(buffer);
      });

      uploadPromises.push(uploadPromise);
    }

    // Đợi tất cả file trong request này tải lên xong
    const uploadResults = await Promise.all(uploadPromises);
    const urls = uploadResults.map((item) => item.url);

    return NextResponse.json({
      success: true,
      message: `Đã upload thành công ${uploadResults.length} ảnh lên Cloudinary!`,
      urls: urls,
      data: uploadResults,
    });
  } catch (error) {
    console.error("Lỗi API Upload:", error);
    let errorMsg = error?.message || "Quá trình upload ảnh lên Cloudinary thất bại.";
    if (typeof errorMsg === "string" && errorMsg.includes("api_secret mismatch")) {
      errorMsg =
        "Khóa bí mật API Secret không khớp (api_secret mismatch). Vui lòng đăng nhập console.cloudinary.com để copy lại chính xác API Secret mới nhất.";
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMsg,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/upload
 * Nhận danh sách URL hoặc publicId để xóa ảnh cũ trên Cloudinary
 */
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { url, publicId, urls, publicIds } = body;

    const targets = [];
    if (url) targets.push(url);
    if (publicId) targets.push(publicId);
    if (Array.isArray(urls)) targets.push(...urls);
    if (Array.isArray(publicIds)) targets.push(...publicIds);

    if (targets.length === 0) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy URL hoặc publicId ảnh cần xóa." },
        { status: 400 }
      );
    }

    const { deleteFromCloudinary } = await import("@/lib/cloudinary");

    const deleteResults = await Promise.allSettled(
      targets.map((t) => deleteFromCloudinary(t))
    );

    return NextResponse.json({
      success: true,
      message: `Đã xử lý xóa ${targets.length} ảnh trên Cloudinary.`,
      results: deleteResults,
    });
  } catch (error) {
    console.error("Lỗi API DELETE /api/upload:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Không thể xóa ảnh trên Cloudinary.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
