import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import SessionProvider from "@/components/SessionProvider";
import AuthButton from "@/components/AuthButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inky: A Writing Archive",
  description: "Post, read, and share writing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
        <SessionProvider>
          {/* Header */}
          <header className="bg-teal-900 text-white shadow">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold tracking-tight hover:text-teal-200">
                Inky
              </Link>
              <nav className="flex items-center gap-4 text-sm">
                <Link href="/works" className="hover:text-teal-200">
                  Browse
                </Link>
                <Link href="/about" className="hover:text-teal-200">
                  About
                </Link>
                <Link
                  href="/works/new"
                  className="px-3 py-1.5 bg-white text-teal-900 rounded font-semibold hover:bg-teal-100"
                >
                  Post a Work
                </Link>
                <AuthButton />
              </nav>
            </div>
          </header>

          {/* Main */}
          <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>

          {/* Footer */}
          <footer className="border-t border-gray-200 mt-12">
            <div className="max-w-6xl mx-auto px-4 py-4 text-center text-xs text-gray-500">
              Inky: A writing archive proof of concept/prototype
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
