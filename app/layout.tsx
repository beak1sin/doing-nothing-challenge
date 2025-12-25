import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "멍때리기 대회 | The Art of Doing Nothing",
  description:
    "아무것도 하지 않고 얼마나 버틸 수 있나요? 당신의 집중력을 테스트하세요!",
  keywords: ["멍때리기", "집중력 테스트", "명상", "게임", "챌린지"],
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "멍때리기 대회 | The Art of Doing Nothing",
    description: "아무것도 하지 않고 얼마나 버틸 수 있나요?",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "멍때리기 대회",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "멍때리기 대회",
    description: "아무것도 하지 않고 얼마나 버틸 수 있나요?",
    images: ["/og-image.png"],
  },
  verification: {
    google: "yp5xM-8OZRGL5_vwH5RfQz3kH1zZ8brjDXteIKnDI48",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
