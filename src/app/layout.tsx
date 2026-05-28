import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "工程伦理及项目管理 - 自测",
  description: "选择题自测工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
