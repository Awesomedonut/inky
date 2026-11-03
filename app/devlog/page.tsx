type Entry = {
  version: string;
  date: string;
  body: string;
};

const ENTRIES: Entry[] = [
  { version: "3.2", date: "Jun 6, 2026", body: "New URL live" },
  { version: "3.1", date: "May 2, 2026", body: "Testing out different colours" },
  { version: "3.0", date: "Apr 3, 2026", body: "Massive UI overhaul" },
  { version: "2.1", date: "Mar 3, 2026", body: "Formatting bug fix" },
  { version: "2.0", date: "Mar 2, 2026", body: "Massive UI change" },
  { version: "1.2", date: "Feb 24, 2026", body: "Add HTML posting option, separate from rich text" },
  { version: "1.1", date: "Feb 20, 2026", body: "Cloudflare safety / bot protection and Google SSO for safety" },
  { version: "1.0", date: "Feb 20, 2026", body: "Created this project Has basic upload story and comment functionality, all anon" },
];

export default function DevlogPage() {
  return (
    <article className="devlog">
      <h1 className="heading">Devlog</h1>
      <ul className="devlog-items">
        {ENTRIES.map((e) => (
          <li key={e.version}>
            Version {e.version} ({e.date}): {e.body}
          </li>
        ))}
      </ul>
    </article>
  );
}
