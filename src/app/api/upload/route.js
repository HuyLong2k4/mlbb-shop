import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * POST /api/upload
 * Tiếp nhận nhiều file ảnh từ Form (multipart/form-data)
 * Upload trực tiếp lên Cloudinary và trả về mảng các URL ảnh
 */
export async function POST(request) {
  try {
    // 1. Kiểm tra cấu hình Cloudinary trong biến môi trường
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Chưa cấu hình Cloudinary! Vui lòng thêm CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY và CLOUDINARY_API_SECRET vào file .env.local",
        },
        { status: 500 }
      );
    }

    // 2. Đọc formData từ request
    const formData = await request.formData();
    // Lấy danh sách các files (hỗ trợ cả trường 'files' và 'file')
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
            folder: "mlbb_accounts", // Thư mục lưu trữ trên Cloudinary
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
                width: result.width,
                height: result.height,
              });
            }
          }
        );

        uploadStream.end(buffer);
      });

      uploadPromises.push(uploadPromise);
    }

    // Đợi tất cả các file tải lên hoàn tất
    const uploadResults = await Promise.all(uploadPromises);

    // Mảng chỉ chứa các URL an toàn (HTTPS)
    const urls = uploadResults.map((item) => item.url);

    return NextResponse.json({
      success: true,
      message: `Đã upload thành công ${uploadResults.length} ảnh lên Cloudinary!`,
      urls: urls,
      data: uploadResults,
    });
  } catch (error) {
    console.error("Lỗi API Upload:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Quá trình upload ảnh lên Cloudinary thất bại.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
