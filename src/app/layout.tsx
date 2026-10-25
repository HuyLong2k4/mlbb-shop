import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

// Domain website chính thức (hoặc localhost khi phát triển)
const siteUrl = process.env.NEXTAUTH_URL || "https://mlbbstore.vn";

// CẤU HÌNH SEO & OPEN GRAPH (FACEBOOK, ZALO, TWITTER CRAWLERS)
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MLBB STORE - Shop Bán Acc Mobile Legends: Bang Bang Uy Tín #1",
    template: "%s | MLBB STORE",
  },
  description:
    "Hệ thống mua bán tài khoản Mobile Legends: Bang Bang tự động 24/7 hàng đầu Việt Nam. Kho nick Rank Thần Thoại, Vinh Quang, Full Skin Collector, Legend, KOF và Acc Sinh Viên giá rẻ chỉ từ 50k. 100% Trắng Thông Tin.",
  keywords: [
    "shop acc mlbb",
    "mua acc mobile legends",
    "shop nick mlbb uy tin",
    "acc mobile legends vip",
    "acc mlbb sinh vien gia re",
    "acc rank than thoai",
    "full skin collector mlbb",
    "mlbb store",
  ],
  authors: [{ name: "MLBB STORE TEAM" }],
  creator: "MLBB STORE",
  publisher: "MLBB STORE",

  // Cấu hình Open Graph chuẩn cho Facebook & Zalo (Tự động liên kết với opengraph-image.tsx)
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    siteName: "MLBB STORE VIETNAM",
    title: "MLBB STORE - Sàn Giao Dịch Tài Khoản Mobile Legends Uy Tín #1",
    description:
      "Mua bán tài khoản Mobile Legends tự động 24/7. Nhận nick sau 30 giây, 100% trắng thông tin, bảo hành đổi trả vĩnh viễn.",
  },

  // Cấu hình Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "MLBB STORE - Shop Bán Acc Mobile Legends: Bang Bang Uy Tín #1",
    description:
      "Kho tài khoản Rank Thần Thoại & Full Skin Collector giá siêu tốt. Giao dịch tự động 24/7.",
  },

  // Khai báo Canonical URL
  alternates: {
    canonical: siteUrl,
  },

  // Robot indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icon
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark scroll-smooth">
      <body
        className={`${inter.variable} min-h-screen flex flex-col bg-navy-950 font-sans text-slate-100 selection:bg-gold-500 selection:text-navy-950`}
      >
        <AuthProvider>
          {/* Navigation Bar */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-1 pt-16 sm:pt-20">{children}</main>

          {/* Footer */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
