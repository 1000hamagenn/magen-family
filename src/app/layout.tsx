import type { Metadata } from "next";
import "./globals.css";  // ← זה השורה החסרה! חובה

export const metadata: Metadata = {
  title: "אלף המגן",
  description: "אפליקציית חירום למשפחות",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}