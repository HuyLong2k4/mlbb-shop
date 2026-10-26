import { v2 as cloudinary } from "cloudinary";

// Cấu hình Cloudinary tập trung
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "daksfvybx",
  api_key: process.env.CLOUDINARY_API_KEY || "473819711181877",
  api_secret: process.env.CLOUDINARY_API_SECRET || "yGS_PcZrzSubqAqQ8G-k2HsMof5o",
  secure: true,
});

export default cloudinary;

/**
 * Trích xuất public_id từ Cloudinary URL an toàn
 * Ví dụ: https://res.cloudinary.com/.../upload/v1729853412/mlbb_accounts/img_01.jpg
 * -> "mlbb_accounts/img_01"
 */
export function getPublicIdFromUrl(url) {
  if (!url || typeof url !== "string") return null;
  if (!url.includes("cloudinary.com")) {
    // Nếu truyền vào đã là public_id (không phải URL http)
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return url;
    }
    return null;
  }

  try {
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    let pathAfterUpload = url.substring(uploadIndex + "/upload/".length);
    const segments = pathAfterUpload.split("/");
    const cleanSegments = [];
    let isPastVersion = false;

    for (const segment of segments) {
      if (!isPastVersion) {
        // Bỏ qua version tag dạng v123456789
        if (/^v\d+$/.test(segment)) {
          isPastVersion = true;
          continue;
        }
        // Bỏ qua transformation params như w_500,q_auto,f_auto
        if (/^(?:[a-z]{1,2}_[a-zA-Z0-9]+,?)+$/.test(segment)) {
          continue;
        }
      }
      cleanSegments.push(segment);
    }

    const fullPath = cleanSegments.join("/");
    const lastDotIndex = fullPath.lastIndexOf(".");
    return lastDotIndex !== -1 ? fullPath.substring(0, lastDotIndex) : fullPath;
  } catch (err) {
    console.error("Lỗi trích xuất public_id từ Cloudinary URL:", err);
    return null;
  }
}

/**
 * Xóa 1 ảnh khỏi Cloudinary qua public_id hoặc URL
 */
export async function deleteFromCloudinary(publicIdOrUrl) {
  if (!publicIdOrUrl) return null;

  const publicId = getPublicIdFromUrl(publicIdOrUrl);
  if (!publicId) return null;

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true, // Xóa cache CDN của Cloudinary
    });
    return result;
  } catch (error) {
    console.error(`Lỗi khi xóa ảnh Cloudinary (${publicId}):`, error);
    return null;
  }
}

/**
 * Xóa nhiều ảnh cùng lúc khỏi Cloudinary
 */
export async function deleteMultipleFromCloudinary(urlsOrPublicIds = []) {
  if (!Array.isArray(urlsOrPublicIds) || urlsOrPublicIds.length === 0) {
    return [];
  }

  const results = await Promise.allSettled(
    urlsOrPublicIds.map((item) => deleteFromCloudinary(item))
  );

  return results;
}
