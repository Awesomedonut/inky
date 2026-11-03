import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import SessionProvider from "@/components/SessionProvider";
import AuthButton from "@/components/AuthButton";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const wordmark = localFont({
  src: "./fonts/fraunces-latin.woff2",
  variable: "--font-wordmark",
  display: "swap",
  weight: "100 900",
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
      className={wordmark.variable}
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

        </SessionProvider>
      </body>
    </html>
  );
}
