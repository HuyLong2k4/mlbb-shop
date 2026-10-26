export type MLBBAccountRank =
  | "Sử Thi"
  | "Huyền Thoại"
  | "Thần Thoại"
  | "Vinh Quang Thần Thoại"
  | "Chí Tôn";

export type MLBBCollectionTier =
  | "Sưu tập truyền kỳ"
  | "Sưu tập siêu cấp"
  | "Nhà đại sưu tập"
  | "Sưu tập thiên hà";

export type AccountStatus = "Còn hàng" | "Đã bán";

export interface AccountWinRate {
  overall: string; // Tỉ lệ thắng tổng (VD: 68.5%)
  totalMatches: number; // Tổng số trận
  rankWinRate: string; // Tỉ lệ thắng trong Rank (VD: 71.2%)
}

export interface MLBBMockAccount {
  id: string;
  title: string;
  price: number; // Đơn vị: VNĐ
  originalPrice?: number; // Giá gốc trước giảm
  rank: MLBBAccountRank;
  collectionTier?: MLBBCollectionTier;
  heroCount: number;
  skinCount: number;
  highlightSkins: string[];
  status: AccountStatus;
  winRate?: AccountWinRate;
  emblems: string[]; // Danh sách Bảng ngọc
  reputationScore: number; // Điểm uy tín (Max 100)
  securityInfo: string; // Trạng thái bảo mật
  description?: string;
  screenshots: {
    id: number;
    title: string;
    caption: string;
    imageUrl?: string;
  }[];
}

export const mockAccounts: MLBBMockAccount[] = [
  {
    id: "MLBB-VIP-001",
    title: "Acc Trùm Đấu Sĩ Rank Chí Tôn - Trọn Bộ KOF & Legend Granger",
    price: 4850000,
    originalPrice: 6200000,
    rank: "Chí Tôn",
    collectionTier: "Sưu tập thiên hà",
    heroCount: 125,
    skinCount: 412,
    highlightSkins: [
      "Granger - Starfall Knight (Legend)",
      "Chou - Iori Yagami (KOF)",
      "Gusion - Cosmic Gleam (Legend)",
      "Fanny - Blade of Kibou (Aspirants)",
      "Lancelot - Pisces (Zodiac)",
      "Hayabusa - Shura (11.11)",
    ],
    status: "Còn hàng",
    winRate: {
      overall: "73.5%",
      totalMatches: 4820,
      rankWinRate: "75.8%",
    },
    emblems: [
      "Sát Thủ Lv.60 (Max)",
      "Đấu Sĩ Lv.60 (Max)",
      "Xạ Thủ Lv.60 (Max)",
      "Pháp Sư Lv.60 (Max)",
      "Hỗ Trợ Lv.60 (Max)",
      "Xe Tăng Lv.60 (Max)",
    ],
    reputationScore: 100,
    securityInfo: "100% Trắng Thông Tin (Chưa liên kết SĐT, đổi Email sạch ngay)",
    description: "Tài khoản VIP thuộc hàng Top máy chủ Việt Nam. Sở hữu 2 skin Legend tối thượng (Granger + Gusion), trọn bộ KOF và dàn skin Aspirants cực phẩm. Bảng ngọc full max cấp không thiếu nhánh nào.",
    screenshots: [
      { id: 1, title: "Trang Cá Nhân & Rank Chí Tôn", caption: "Rank Chí Tôn 145 Sao mùa hiện tại" },
      { id: 2, title: "Bộ Sưu Tập Skin Legend & KOF", caption: "Full bộ hiệu ứng biến về, khung viền KOF đặc quyền" },
      { id: 3, title: "Biểu Đồ Tỉ Lệ Thắng Tổng & Rank", caption: "Winrate 73.5% với hơn 4.800 trận đấu rank" },
      { id: 4, title: "Hệ Thống Bảng Ngọc Max 60/60", caption: "Tất cả 6 bảng ngọc chính đều đạt cấp độ tối đa" },
    ],
  },
  {
    id: "MLBB-VIP-002",
    title: "Acc Vinh Quang Thần Thoại 125 Sao - Full Tướng All Skin Collector",
    price: 3600000,
    originalPrice: 4800000,
    rank: "Vinh Quang Thần Thoại",
    collectionTier: "Nhà đại sưu tập",
    heroCount: 125,
    skinCount: 345,
    highlightSkins: [
      "Franco - King of Hell (Legend)",
      "Ling - Serene Plume (Collector)",
      "Hayabusa - Shura (11.11)",
      "Claude - Bad Bro (Sanrio)",
      "Valir - Demonlord (Collector)",
    ],
    status: "Còn hàng",
    winRate: {
      overall: "69.8%",
      totalMatches: 3650,
      rankWinRate: "71.4%",
    },
    emblems: [
      "Sát Thủ Lv.60 (Max)",
      "Đấu Sĩ Lv.60 (Max)",
      "Xạ Thủ Lv.60 (Max)",
      "Pháp Sư Lv.60 (Max)",
    ],
    reputationScore: 100,
    securityInfo: "Trắng Thông Tin - Bảo hành vĩnh viễn không tranh chấp",
    description: "Tài khoản chuyên Sát thủ Rừng và Đấu sĩ. Đầy đủ tướng mùa mới nhất, sở hữu Franco Legend độc bản và dàn Collector cực kỳ đắt giá.",
    screenshots: [
      { id: 1, title: "Tổng Quan Rank Vinh Quang 125 Sao", caption: "Thần Thoại Vinh Quang khung viền vàng kim" },
      { id: 2, title: "Dàn Skin Collector & Franco Legend", caption: "Hiệu ứng kỹ năng tùy biến cao cấp" },
      { id: 3, title: "Thống Kê Tướng Rừng Tủ Ling & Hayabusa", caption: "Hơn 1.200 trận tỉ lệ thắng 74%" },
      { id: 4, title: "Bảng Ngọc Max Level", caption: "Bảng ngọc Sát thủ & Xạ thủ nhánh chuẩn giải đấu" },
    ],
  },
  {
    id: "MLBB-VIP-003",
    title: "Nick Pháp Sư & Xạ Thủ Rank Thần Thoại - Lesley & Guinevere Legend",
    price: 2450000,
    originalPrice: 3200000,
    rank: "Thần Thoại",
    collectionTier: "Sưu tập siêu cấp",
    heroCount: 118,
    skinCount: 268,
    highlightSkins: [
      "Lesley - Angelic Agent (Legend)",
      "Guinevere - Psion of Tomorrow (Legend)",
      "Kagura - Water Lily (Annual Starlight)",
      "Lunox - Dawn Revelation (Epic)",
    ],
    status: "Đã bán",
    winRate: {
      overall: "66.2%",
      totalMatches: 2900,
      rankWinRate: "68.0%",
    },
    emblems: [
      "Pháp Sư Lv.60 (Max)",
      "Xạ Thủ Lv.60 (Max)",
      "Hỗ Trợ Lv.58",
    ],
    reputationScore: 100,
    securityInfo: "Đã bàn giao tài khoản thành công cho khách hàng",
    description: "Tài khoản chuyên vị trí Pháp Sư Mid Lane và Xạ Thủ Gold Lane với 2 skin Legend siêu hiếm Lesley Thiên Hà và Guinevere Hồ Điệp.",
    screenshots: [
      { id: 1, title: "Trang Cá Nhân Rank Thần Thoại", caption: "Huy hiệu Thần Thoại mùa hiện tại" },
      { id: 2, title: "Skin Lesley Angelic Agent", caption: "Khung viền Legend độc quyền" },
      { id: 3, title: "Thống Kê Winrate Pháp Sư", caption: "Kagura, Lunox, Pharsa winrate trên 70%" },
    ],
  },
  {
    id: "MLBB-VIP-004",
    title: "Acc Sát Thủ One Champ Fanny & Chou - Winrate 78% Thần Thoại",
    price: 1850000,
    originalPrice: 2500000,
    rank: "Thần Thoại",
    collectionTier: "Sưu tập siêu cấp",
    heroCount: 105,
    skinCount: 195,
    highlightSkins: [
      "Fanny - Skylark (Epic Limited)",
      "Chou - Thunderfist (HERO)",
      "Lancelot - Pisces (Zodiac)",
      "Gusion - V-Venom Emperor",
    ],
    status: "Còn hàng",
    winRate: {
      overall: "78.2%",
      totalMatches: 2450,
      rankWinRate: "81.0%",
    },
    emblems: [
      "Sát Thủ Lv.60 (Max)",
      "Đấu Sĩ Lv.60 (Max)",
    ],
    reputationScore: 100,
    securityInfo: "Trắng Thông Tin 100% - Bảo hành trọn đời tài khoản",
    description: "Dành riêng cho các thần đồng leo rank bằng Fanny và Chou. Tỉ lệ thắng siêu khủng 78% với chuỗi thắng dài, sẵn sàng gánh team mọi bậc rank.",
    screenshots: [
      { id: 1, title: "Thống Kê Tướng Tủ Fanny", caption: "Hơn 1.500 trận Fanny tỉ lệ thắng 82%" },
      { id: 2, title: "Skin Fanny Skylark & Chou HERO", caption: "Hiệu ứng bay dây và combo cực mượt" },
      { id: 3, title: "Bảng Ngọc Sát Thủ Cấp 60", caption: "Tối ưu hóa sát thương xuyên giáp và tốc chạy" },
    ],
  },
  {
    id: "MLBB-MID-005",
    title: "Acc Huyền Thoại Chuẩn Meta - Dàn Skin Prime & Transformers Cực Cháy",
    price: 850000,
    originalPrice: 1200000,
    rank: "Huyền Thoại",
    collectionTier: "Sưu tập truyền kỳ",
    heroCount: 92,
    skinCount: 135,
    highlightSkins: [
      "Granger - Megatron (Transformers)",
      "Beatrix - Stellar Brilliance (Prime)",
      "Gusion - K' (KOF)",
    ],
    status: "Còn hàng",
    winRate: {
      overall: "62.4%",
      totalMatches: 1850,
      rankWinRate: "64.5%",
    },
    emblems: [
      "Xạ Thủ Lv.58",
      "Sát Thủ Lv.55",
      "Đấu Sĩ Lv.52",
    ],
    reputationScore: 100,
    securityInfo: "Trắng Thông Tin - Đổi sang Gmail mới của bạn ngay",
    description: "Tài khoản giá tầm trung nhưng sở hữu skin hợp tác Transformers Megatron và Beatrix Prime cực kỳ ngầu. Thích hợp leo rank Thần Thoại.",
    screenshots: [
      { id: 1, title: "Trang Cá Nhân Rank Huyền Thoại II", caption: "Tỷ lệ thắng ổn định chuẩn bị lên Thần Thoại" },
      { id: 2, title: "Skin Granger Megatron", caption: "Hiệu ứng giọng lồng tiếng Transformers gốc" },
      { id: 3, title: "Bộ Sưu Tập Tướng Meta", caption: "Đầy đủ tướng hot pick giải MPL" },
    ],
  },
  {
    id: "MLBB-MID-006",
    title: "Nick Smurf Rank Huyền Thoại - Đủ Bộ Tướng Rừng Bảng Ngọc Max 60",
    price: 490000,
    originalPrice: 750000,
    rank: "Huyền Thoại",
    collectionTier: "Sưu tập truyền kỳ",
    heroCount: 78,
    skinCount: 88,
    highlightSkins: [
      "Hayabusa - Shadow of Obscurity (Epic Limited)",
      "Zilong - Empyrean Dragon (Collector)",
    ],
    status: "Đã bán",
    winRate: {
      overall: "65.1%",
      totalMatches: 1200,
      rankWinRate: "67.8%",
    },
    emblems: [
      "Sát Thủ Lv.60 (Max)",
      "Đấu Sĩ Lv.50",
    ],
    reputationScore: 100,
    securityInfo: "Đã giao dịch hoàn tất qua MoMo tự động",
    description: "Nick smurf cày chay cực chuẩn, điểm uy tín tuyệt đối, đã mở đủ tướng đi rừng phổ biến.",
    screenshots: [
      { id: 1, title: "Rank Huyền Thoại I", caption: "Nick smurf sạch, thông số đẹp" },
      { id: 2, title: "Bảng Ngọc Sát Thủ Cấp 60", caption: "Max điểm cộng xuyên giáp vật lý" },
    ],
  },
  {
    id: "MLBB-STU-007",
    title: "Acc Sinh Viên Rank Sử Thi - Trắng Thông Tin Đổi Pass Ngay",
    price: 169000,
    originalPrice: 280000,
    rank: "Sử Thi",
    collectionTier: "Sưu tập truyền kỳ",
    heroCount: 56,
    skinCount: 45,
    highlightSkins: [
      "Chou - Dragon Boy (Epic)",
      "Alucard - Child of the Fall (Epic)",
    ],
    status: "Còn hàng",
    winRate: {
      overall: "58.5%",
      totalMatches: 850,
      rankWinRate: "60.2%",
    },
    emblems: [
      "Đấu Sĩ Lv.52",
      "Sát Thủ Lv.48",
      "Xạ Thủ Lv.45",
    ],
    reputationScore: 100,
    securityInfo: "100% Trắng Thông Tin - Đổi pass trong 30 giây",
    description: "Mức giá cực kỳ sinh viên chỉ bằng vài cốc trà sữa. Đầy đủ các tướng quốc dân Chou, Alucard, Zilong, Miya để quẩy rank cùng bạn bè.",
    screenshots: [
      { id: 1, title: "Trang Cá Nhân Rank Sử Thi I", caption: "Sẵn sàng lên Huyền Thoại" },
      { id: 2, title: "Skin Chou Dragon Boy", caption: "Skin Epic múa mượt mà" },
    ],
  },
  {
    id: "MLBB-STU-008",
    title: "Acc Tập Chơi Rank Sử Thi - Tướng Tủ Miya & Layla Leo Rank Dễ Dàng",
    price: 89000,
    originalPrice: 150000,
    rank: "Sử Thi",
    collectionTier: "Sưu tập truyền kỳ",
    heroCount: 42,
    skinCount: 28,
    highlightSkins: [
      "Miya - Modena Butterfly (Legend)",
      "Layla - Miss Hikari (Aspirants)",
    ],
    status: "Còn hàng",
    winRate: {
      overall: "55.8%",
      totalMatches: 620,
      rankWinRate: "57.5%",
    },
    emblems: [
      "Xạ Thủ Lv.48",
      "Pháp Sư Lv.42",
    ],
    reputationScore: 100,
    securityInfo: "100% Trắng Thông Tin - Nhận nick tự động ngay sau thanh toán",
    description: "Acc giá rẻ nhất shop cho người mới chơi hoặc game thủ muốn tập chơi Xạ Thủ. Sở hữu skin Miya Legend và Layla Aspirants siêu đáng yêu.",
    screenshots: [
      { id: 1, title: "Giao Diện Tướng Xạ Thủ", caption: "Miya & Layla trang phục đẹp mắt" },
      { id: 2, title: "Thông Tin Tài Khoản Sạch", caption: "Không cài đặt bảo mật phức tạp" },
    ],
  },
];
