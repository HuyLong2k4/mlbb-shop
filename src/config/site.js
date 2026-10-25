/**
 * ==============================================================================
 * SINGLE SOURCE OF TRUTH (SSOT) - CẤU HÌNH THÔNG TIN TOÀN BỘ WEBSITE
 * ==============================================================================
 * Tất cả thông tin liên hệ, hotline, Zalo, email, mạng xã hội và thương hiệu
 * được quản lý tập trung tại đây để dễ dàng thay đổi mà không phải sửa từng file.
 */

const rawPhone = process.env.NEXT_PUBLIC_ADMIN_PHONE || "0988123456";
const cleanPhone = rawPhone.replace(/\D/g, "");

export const siteConfig = {
  name: "MLBB STORE",
  shortName: "MLBB STORE",
  tagline: "Sàn Giao Dịch Acc MLBB Uy Tín #1 Việt Nam",
  description:
    "Hệ thống mua bán tài khoản Mobile Legends: Bang Bang tự động 24/7 uy tín #1 Việt Nam. Kho nick Rank Thần Thoại, Vinh Quang, Full Skin Collector, Legend, KOF và Acc Sinh Viên giá rẻ. 100% Trắng Thông Tin, bảo hành trọn đời.",
  url: process.env.NEXTAUTH_URL || "https://mlbbstore.vn",

  // Thông tin liên hệ chính (Single Source of Truth)
  contact: {
    phone: cleanPhone || "0988123456",
    hotline: "0988.123.456",
    hotlineDisplay: "0988.123.456",
    hotlineEmergency: "1900.8888",
    zalo: cleanPhone || "0988123456",
    zaloDisplay: "0988.123.456",
    zaloName: "CSKH STORE",
    zaloUrl: `https://zalo.me/${cleanPhone || "0988123456"}`,
    email: "hotro@mlbbstore.vn",
    // address: "Tòa nhà Keangnam Landmark 72, Phạm Hùng, Nam Từ Liêm, Hà Nội",
    workingHours: "08:00 - 24:00 hàng ngày",
    supportResponseTime: "Phản hồi nhanh trong 1 - 3 phút",
  },

  // Kênh kết nối mạng xã hội
  socials: {
    facebook: "https://facebook.com/mlbbstore.official",
    facebookDisplay: "fb.com/mlbbstore.official",
    group: "https://t.me/mlbbstore_cskh",
    groupDisplay: "@mlbbstore_cskh",
    zalo: `https://zalo.me/${cleanPhone || "0988123456"}`,
  },

  // Cam kết vàng dịch vụ
  commitments: {
    warranty: "Bảo hành vĩnh viễn",
    deliveryTime: "Giao dịch & đổi gmail trong 30 giây",
    security: "100% Trắng Thông Tin - Đổi Gmail ngay",
    refund: "Hoàn tiền 100% nếu sai mô tả",
  },
};

export default siteConfig;
