import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MLBB STORE - Sàn Giao Dịch Tài Khoản Mobile Legends: Bang Bang Uy Tín #1";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#060a17",
          backgroundImage: "radial-gradient(circle at 50% 30%, #14234f 0%, #060a17 80%)",
          color: "white",
          fontFamily: "sans-serif",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Border glow */}
        <div
          style={{
            position: "absolute",
            inset: 24,
            border: "2px solid rgba(234, 179, 8, 0.4)",
            borderRadius: 24,
          }}
        />

        {/* Micro Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "#14234f",
            border: "1px solid #eab308",
            borderRadius: 9999,
            padding: "8px 24px",
            color: "#fde047",
            fontSize: 20,
            fontWeight: "bold",
            letterSpacing: 2,
            marginBottom: 20,
            textTransform: "uppercase",
          }}
        >
          ⚡ SÀN GIAO DỊCH ACC MLBB UY TÍN #1 VIỆT NAM
        </div>

        {/* Brand Headline */}
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: -1,
            color: "#ffffff",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          MLBB <span style={{ color: "#eab308", marginLeft: 18 }}>STORE</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 26,
            color: "#cbd5e1",
            maxWidth: 820,
            textAlign: "center",
            marginBottom: 44,
          }}
        >
          Acc Rank Thần Thoại • Full Skin Collector & Prime • Giá Rẻ Từ 50k
        </div>

        {/* Trust Badges Bar */}
        <div
          style={{
            display: "flex",
            gap: 20,
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "1px solid #10b981",
              borderRadius: 14,
              padding: "12px 24px",
              color: "#6ee7b7",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            🛡️ 100% Trắng Thông Tin
          </div>
          <div
            style={{
              backgroundColor: "rgba(234, 179, 8, 0.15)",
              border: "1px solid #eab308",
              borderRadius: 14,
              padding: "12px 24px",
              color: "#fde047",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            ⚡ Giao Nick Sau 30 Giây
          </div>
          <div
            style={{
              backgroundColor: "rgba(59, 130, 246, 0.15)",
              border: "1px solid #3b82f6",
              borderRadius: 14,
              padding: "12px 24px",
              color: "#93c5fd",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            💎 Bảo Hành Trọn Đời
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
