import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { siteConfig } from "@/config/site";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

// Domain website chính thức (hoặc localhost khi phát triển)
const siteUrl = siteConfig.url;

// CẤU HÌNH SEO & OPEN GRAPH (FACEBOOK, ZALO, TWITTER CRAWLERS)
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} - Shop Bán Acc Mobile Legends: Bang Bang Uy Tín #1`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "shop acc mlbb",
    "mua acc mobile legends",
    "shop nick mlbb uy tin",
    "acc mobile legends vip",
    "acc mlbb sinh vien gia re",
    "acc rank than thoai",
    "full skin collector mlbb",
    "shop qaut",
  ],
  authors: [{ name: `${siteConfig.name} TEAM` }],
  creator: siteConfig.name,
  publisher: siteConfig.name,

  // Cấu hình Open Graph chuẩn cho Facebook & Zalo (Tự động liên kết với opengraph-image.tsx)
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
  },

  // Cấu hình Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "SHOP QAUT - Shop Bán Acc Mobile Legends: Bang Bang Uy Tín #1",
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

  // Icon Tab Trình Duyệt (Favicon)
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
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
        <Analytics />
      </body>
    </html>
  );
}
