import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YuridikSim AI — Yuridik kazus va hujjatlar amaliyoti platformasi",
  description:
    "O'zbekiston yuridik ta'limi uchun sun'iy intellekt asosidagi interaktiv kazuslar va huquqiy hujjat laboratoriyasi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className="min-h-screen bg-[#F7F9FC] text-[#172033] antialiased">
        {children}
      </body>
    </html>
  );
}
