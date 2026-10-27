export interface OptimizeImageOptions {
  width?: number;
  height?: number;
  quality?: string | number;
  format?: string;
  crop?: string;
}

/**
 * Tối ưu hóa URL ảnh Cloudinary:
 * - Tự động chuyển đổi định dạng nhẹ nhất: WebP / AVIF (f_auto)
 * - Tự động nén thông minh giữ trọn độ nét (q_auto)
 * - Giới hạn kích thước chiều rộng phù hợp giao diện (w_xxx, c_limit)
 * - Tải trực tiếp từ Cloudinary CDN, KHÔNG tiêu tốn băng thông 100GB của Vercel
 */
export function getOptimizedImageUrl(
  url?: string | null,
  options: OptimizeImageOptions = {}
): string {
  if (!url || typeof url !== "string") return "";

  // Nếu không phải ảnh Cloudinary hoặc là ảnh local SVG/data URL
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  // Nếu URL đã có các tham số tối ưu rồi thì không chèn lặp lại
  if (url.includes("/f_auto") || url.includes("/q_auto")) {
    return url;
  }

  const {
    width = 600,
    height,
    quality = "auto",
    format = "auto",
    crop = "limit",
  } = options;

  const transformations: string[] = [`f_${format}`, `q_${quality}`];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (width || height) transformations.push(`c_${crop}`);

  const transformString = transformations.join(",");

  return url.replace("/upload/", `/upload/${transformString}/`);
}
