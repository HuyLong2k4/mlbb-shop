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
  name: "SHOP QAUT",
  shortName: "SHOP QAUT",
  tagline: "Sàn Giao Dịch Acc MLBB Uy Tín #1 Việt Nam",
  description:
    "Hệ thống mua bán tài khoản Mobile Legends: Bang Bang tự động 24/7 uy tín #1 Việt Nam. Kho nick Rank Thần Thoại, Vinh Quang, Full Skin Collector, Legend, KOF và Acc Sinh Viên giá rẻ. 100% Trắng Thông Tin, bảo hành trọn đời.",
  url: process.env.NEXTAUTH_URL || "https://mlbbstore.vn",

  // Thông tin liên hệ chính (Single Source of Truth)
  contact: {
    phone: cleanPhone || "0334938620",
    hotline: "0334938620",
    hotlineDisplay: "0334938620",
    hotlineEmergency: "0334938620",
    zalo: cleanPhone || "0334938620",
    zaloDisplay: "0334938620",
    zaloName: "CSKH STORE",
    zaloUrl: "http://zalo.me/84334938620",
    email: "hotro@mlbbstore.vn",
    // address: "Tòa nhà Keangnam Landmark 72, Phạm Hùng, Nam Từ Liêm, Hà Nội",
    workingHours: "08:00 - 24:00 hàng ngày",
    supportResponseTime: "Phản hồi nhanh trong 1 - 3 phút",
  },

  // Kênh kết nối mạng xã hội
  socials: {
    facebook: "https://www.facebook.com/share/1Dpyi3MXj8/?mibextid=wwXIfr",
    facebookDisplay: "fb.com/mlbbstore.official",
    group: "https://zalo.me/g/28le7smf3o9cd6zevshd",
    groupDisplay: "@mlbbstore_cskh",
    zalo: `https://zalo.me/${cleanPhone || "0334938620"}`,
  },

  // Cam kết vàng dịch vụ
  commitments: {
    warranty: "Bảo hành 3 tháng",
    deliveryTime: "Giao dịch nhanh chóng",
    security: "100% Trắng Thông Tin",
    refund: "Hoàn tiền 100% nếu sai mô tả",
  },
};

export default siteConfig;
