import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "일일 동향파악",
  description: "T안심알리미 경쟁사 및 시장동향 내부 리포팅 서비스",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
