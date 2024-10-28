import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Ubuntu } from 'next/font/google'
import { FaTools } from "react-icons/fa";

// Initialize the font
const ubuntu = Ubuntu({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Type Typing",
  description: "What does changing this do?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ubuntu.className} antialiased`}
      >
        <header className="bg-gray-900 p-4">
        <div className="flex justify-between items-center">
          <div className="w-40 h-10 bg-gray-800 rounded flex items-center justify-center text-center">Type Typing</div>
          <nav className="flex gap-8">
            <FaTools className="text-2xl cursor-pointer" title="In Development" />
            <FaTools className="text-2xl cursor-pointer" title="In Development"/>
            <FaTools className="text-2xl cursor-pointer" title="In Development"/>
            <FaTools className="text-2xl cursor-pointer" title="In Development"/>
            <FaTools className="text-2xl cursor-pointer" title="In Development"/>
          </nav>
          <div className="w-40"></div>
        </div>
      </header>
        {children}
      </body>
    </html>
  );
}
