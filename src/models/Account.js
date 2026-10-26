import mongoose from "mongoose";

// Sub-schema cho từng ảnh chụp màn hình trong game
const ScreenshotSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      default: 1,
    },
    title: {
      type: String,
      default: "Ảnh in-game",
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
      default: "Chi tiết tài khoản",
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

// Sub-schema cho thống kê Tỉ lệ thắng (Winrate)
const WinRateSchema = new mongoose.Schema(
  {
    overall: {
      type: String,
      default: "50.0%",
      trim: true,
    },
    totalMatches: {
      type: Number,
      default: 0,
      min: [0, "Tổng số trận không được âm"],
    },
    rankWinRate: {
      type: String,
      default: "50.0%",
      trim: true,
    },
  },
  { _id: false }
);

// Schema chính cho Tài khoản Mobile Legends: Bang Bang
const AccountSchema = new mongoose.Schema(
  {
    // Mã tài khoản (Ví dụ: MLBB-VIP-001)
    id: {
      type: String,
      required: [true, "Mã tài khoản (ID) là bắt buộc"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    // Tiêu đề rao bán tài khoản
    title: {
      type: String,
      required: [true, "Tiêu đề tài khoản là bắt buộc"],
      trim: true,
      maxlength: [200, "Tiêu đề không được vượt quá 200 ký tự"],
    },

    // Giá bán thực tế (VNĐ)
    price: {
      type: Number,
      required: [true, "Giá bán là bắt buộc"],
      min: [0, "Giá bán không được nhỏ hơn 0 VNĐ"],
      index: true,
    },

    // Giá niêm yết ban đầu trước giảm (VNĐ)
    originalPrice: {
      type: Number,
      min: [0, "Giá gốc không được nhỏ hơn 0 VNĐ"],
      default: null,
    },

    // Bậc Rank cao nhất của tài khoản
    rank: {
      type: String,
      required: [true, "Bậc Rank là bắt buộc"],
      enum: {
        values: [
          "Sử Thi",
          "Huyền Thoại",
          "Thần Thoại",
          "Vinh Quang Thần Thoại",
          "Chí Tôn",
        ],
        message: "{VALUE} không phải là bậc Rank hợp lệ trong MLBB",
      },
      index: true,
    },

    // Cấp bậc Điểm Sưu Tập trong MLBB
    collectionTier: {
      type: String,
      enum: {
        values: [
          "Sưu tập truyền kỳ",
          "Sưu tập siêu cấp",
          "Nhà đại sưu tập",
          "Sưu tập thiên hà",
          "Khác",
        ],
        message: "{VALUE} không phải là bậc Điểm sưu tập hợp lệ",
      },
      default: "Sưu tập truyền kỳ",
      index: true,
    },

    // Số lượng tướng sở hữu
    heroCount: {
      type: Number,
      default: 0,
      min: [0, "Số lượng tướng không được âm"],
    },

    // Số lượng trang phục (Skin) sở hữu
    skinCount: {
      type: Number,
      default: 0,
      min: [0, "Số lượng trang phục không được âm"],
    },

    // Danh sách skin hiếm nổi bật (Legend, Collector, KOF, Aspirants...)
    highlightSkins: {
      type: [String],
      default: [],
    },

    // Trạng thái tài khoản
    status: {
      type: String,
      required: [true, "Trạng thái tài khoản là bắt buộc"],
      enum: {
        values: ["Còn hàng", "Đã bán"],
        message: "{VALUE} không phải là trạng thái hợp lệ",
      },
      default: "Còn hàng",
      index: true,
    },

    // Thống kê Winrate
    winRate: {
      type: WinRateSchema,
      default: () => ({
        overall: "50.0%",
        totalMatches: 0,
        rankWinRate: "50.0%",
      }),
    },

    // Tình trạng bảng ngọc: "Full" hoặc "Gần Full"
    emblems: {
      type: mongoose.Schema.Types.Mixed,
      default: "Full",
    },

    // Điểm uy tín trong game (Max 100)
    reputationScore: {
      type: Number,
      default: 100,
      min: [0, "Điểm uy tín tối thiểu là 0"],
      max: [100, "Điểm uy tín tối đa là 100"],
    },

    // Tình trạng thông tin bảo mật (Trắng thông tin, đổi email...)
    securityInfo: {
      type: String,
      default: "100% Trắng Thông Tin (Chưa liên kết SĐT, đổi Email sạch ngay)",
      trim: true,
    },

    // Mô tả chi tiết tài khoản
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Danh sách ảnh chụp màn hình in-game thực tế
    screenshots: {
      type: [ScreenshotSchema],
      default: [],
    },

    // Mảng lưu trực tiếp các link ảnh Cloudinary (URL Strings)
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Account = mongoose.models.Account || mongoose.model("Account", AccountSchema);

export default Account;
