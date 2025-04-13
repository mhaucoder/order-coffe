import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "PAP - Order Food",
  description: "Ứng dụng đặt món",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable}`}>
      <body className="antialiased font-sans bg-gray-50 text-gray-800">
        {children}
        <ToastContainer position="top-center" autoClose={1500} />
        <Footer />
      </body>
    </html>
  );
}