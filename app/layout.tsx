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
  title: "Inky 2.0",
  description: "Post, read, and share writing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <head>
        {gaMeasurementId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaMeasurementId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <SessionProvider>
          <div id="outer" className="wrapper">
            <ul id="skiplinks">
              <li><a href="#main">Main Content</a></li>
            </ul>
            <header id="header" className="region">
              <h1 className="heading">
                <Link href="/">
                  <span>Inky</span>
                  <sup> beta</sup>

                </Link>
              </h1>
              <AuthButton />
              <nav aria-label="Site">
                <ul className="primary navigation actions">
                  <li><Link href="/works">Browse</Link></li>
                  <li><Link href="/works/new">Post</Link></li>
                  <li><Link href="/about">About</Link></li>
                  <li><Link href="/devlog">Devlog</Link></li>
                  <li className="search">
                    <form action="/works" method="get" className="search">
                      <fieldset>
                        <p>
                          <input type="text" name="q" placeholder="Search Works" />
                          <button className="primary" type="submit">Search</button>
                        </p>
                      </fieldset>
                    </form>
                  </li>
                </ul>
              </nav>
              <div className="clear"></div>
            </header>
            <div id="inner" className="wrapper">
              <div id="main" className="region" role="main">
                {children}
                <div className="clear"></div>
              </div>
            </div>
            <footer id="footer" role="contentinfo" className="region">
              <ul className="navigation actions" role="navigation">
                <li><Link href="/works">Works</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/devlog">Devlog</Link></li>
              </ul>
              <p className="copyright">Inky is a prototype archive interface.</p>
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
