import Link from "next/link";

export default function AboutPage() {
  return (
    <article className="prose-page">
      <header className="prose-page-header">
        <p className="eyebrow">About</p>
        <h1 className="prose-page-title">Inky is a writing archive built around safety.</h1>
        <p className="prose-page-lede">
          A prototype. An interest check. A small archive that takes care of the people who write here.
        </p>
      </header>

      <div className="prose-page-body">
        <p>
          Welcome to Inky (name tentative), a writing archive for sharing and reading creative work. The site is currently a prototype and interest check.
        </p>

        <p>
          Inky is heavily inspired by AO3, but built with a stricter focus on creator safety. The project started after seeing many conversations about hate spam, botted comment abuse, and the spread of NSFW underage RPF content.
        </p>

        <p>
          This site is heavily under construction. Join the{" "}
          <Link href="https://discord.gg/hxSA6Gftwt" target="_blank" rel="noopener noreferrer">discord</Link>{" "}
          for more dev updates.
        </p>

        <h2>Principles</h2>
        <ul>
          <li>No NSFW content of minors.</li>
          <li>Free to use.</li>
          <li>No ads.</li>
          <li>No trackers.</li>
          <li>Strong protection against bot spam.</li>
          <li>Writers own their content.</li>
        </ul>

        <h2>Contact</h2>
        <p>
          I&apos;m u/foodiepower on reddit and @whyjs on tumblr. Feedback, suggestions, comments, bugs — all appreciated. If you want to volunteer and help, that would be amazing.
        </p>
      </div>
    </article>
  );
}
