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
  | "Sưu tập thiên hà"
  | "Khác";

export type AccountStatus = "Còn hàng" | "Đã bán";

export interface AccountWinRate {
  overall: string; // Tỉ lệ thắng tổng (VD: 68.5%)
  totalMatches: number; // Tổng số trận
  rankWinRate: string; // Tỉ lệ thắng trong Rank (VD: 71.2%)
}

export interface AccountScreenshot {
  id: number;
  title: string;
  caption: string;
  imageUrl?: string;
}

export interface AccountData {
  _id?: string;
  id: string;
  title: string;
  price: number; // Đơn vị: VNĐ
  originalPrice?: number; // Giá gốc trước giảm
  rank?: MLBBAccountRank | string;
  collectionTier?: MLBBCollectionTier | string;
  heroCount: number;
  skinCount: number;
  highlightSkins: string[];
  status: AccountStatus | string;
  winRate?: AccountWinRate;
  emblems: "Full" | "Gần Full" | string | string[]; // Tình trạng Bảng ngọc: "Full" hoặc "Gần Full"
  reputationScore: number; // Điểm uy tín (Max 100)
  securityInfo: string; // Trạng thái bảo mật
  description?: string;
  screenshots: AccountScreenshot[];
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Alias cho các component trước đây dùng MLBBMockAccount
export type MLBBMockAccount = AccountData;
