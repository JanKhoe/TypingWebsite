import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Ubuntu } from 'next/font/google'
import { FaTools } from "react-icons/fa";
import Option from "./components/option";
import { LayoutProvider } from "./layoutContext";
import RedirectDiv  from './components/redirectDiv';


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
    <LayoutProvider>
      <body
        className={`${ubuntu.className} antialiased`}
      >
        <header className="bg-gray-900 p-4">
        <div className="flex justify-between items-center">
          <div className="w-40 h-10 bg-gray-800 rounded flex items-center justify-center text-center">Type Typing</div>
          <nav className="flex gap-8">

            <div className="mode-selector">
              <div className="mode-header">RANDOM</div>
              <div className="mode-options">
                <Option Mode={1} Params={[10]} innerText={'10'} className="mode-option"></Option>
                <Option Mode={1} Params={[20]} innerText={'20'} className="mode-option"></Option>
                <Option Mode={1} Params={[50]} innerText={'50'} className="mode-option"></Option>
              </div>
            </div>

            <div className="mode-selector">
              <div className="mode-header">PARAGRAPH</div>
              <div className="mode-options">
                <Option Mode={2} Params={[1]} innerText={'RANDOM'} className="mode-option" ></Option>
              </div>
            </div>

            <div className="mode-selector">
              <RedirectDiv innerText="CUSTOM" link="/options" className="mode-header"></RedirectDiv>
            </div>

            <FaTools className="text-2xl cursor-pointer" title="In Development"/>
            <FaTools className="text-2xl cursor-pointer" title="In Development"/>
          </nav>
          <div className="w-40"></div>
        </div>
      </header>
        {children}
      </body>
      </LayoutProvider>
    </html>
  );
}
