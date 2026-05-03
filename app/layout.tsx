import type { Metadata } from "next";
import { Inter, Source_Serif_4, Fraunces, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import SessionProvider from "@/components/SessionProvider";
import AuthButton from "@/components/AuthButton";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans-loaded",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const serif = Source_Serif_4({
  variable: "--font-serif-loaded",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const display = Fraunces({
  variable: "--font-display-loaded",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-loaded",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${serif.variable} ${display.variable} ${mono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('inky-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SH8WF9BPJL" />
        <script
          dangerouslySetInnerHTML={{
            __html: "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-SH8WF9BPJL');",
          }}
        />
      </head>
      <body className="antialiased">
        <SessionProvider>
          <ul id="skiplinks">
            <li><a href="#main">Main Content</a></li>
          </ul>

          <header className="site-header">
            <div className="header-inner">
              <Link href="/" className="site-logo">Inky<span className="dot" aria-hidden="true" /></Link>
              <nav className="site-nav" aria-label="Site">
                <Link href="/works">Browse</Link>
                <Link href="/works/new">Post</Link>
                <Link href="/about">About</Link>
                <Link href="/devlog">Devlog</Link>
              </nav>
              <div className="header-right">
                <form action="/works" method="get" className="header-search">
                  <input type="text" name="q" placeholder="Search…" />
                </form>
                <ThemeToggle />
                <AuthButton />
              </div>
            </div>
          </header>

          <main id="main" className="site-main">
            {children}
          </main>

          <footer className="site-footer" role="contentinfo">
            <div className="footer-inner">
              <span className="footer-logo">Inky</span>
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
