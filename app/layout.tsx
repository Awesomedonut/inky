import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import SessionProvider from "@/components/SessionProvider";
import AuthButton from "@/components/AuthButton";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Inky 2.0",
  description: "Post, read, and share writing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SH8WF9BPJL" />
        <script
          dangerouslySetInnerHTML={{
            __html: "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-SH8WF9BPJL');",
          }}
        />
      </head>
      <body className={`${outfit.variable} ${plusJakarta.variable} antialiased`}>
        <SessionProvider>
          <ul id="skiplinks">
            <li><a href="#main">Main Content</a></li>
          </ul>

          <header className="site-header">
            <div className="header-inner">
              <Link href="/" className="site-logo">inky</Link>
              <nav className="site-nav" aria-label="Site">
                <Link href="/works">Browse</Link>
                <Link href="/works/new">Post</Link>
                <Link href="/about">About</Link>
                <Link href="/devlog">Devlog</Link>
              </nav>
              <div className="header-right">
                <form action="/works" method="get" className="header-search">
                  <input type="text" name="q" placeholder="Search..." />
                </form>
                <AuthButton />
              </div>
            </div>
          </header>

          <main id="main" className="site-main">
            {children}
          </main>

          <footer className="site-footer" role="contentinfo">
            <div className="footer-inner">
              <span className="footer-logo">inky</span>
              <nav className="footer-nav">
                <Link href="/works">Works</Link>
                <Link href="/about">About</Link>
                <Link href="/devlog">Devlog</Link>
              </nav>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
