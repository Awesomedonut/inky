export default function DevlogPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="archive-panel p-6">
        <h1 className="text-3xl text-gray-800 mb-4">Devlog</h1>

        <div className="prose max-w-none text-gray-700 space-y-4">
        </div>

        <p>Version 2.1 (mar 3rd 2026): Formatting bug fix</p>

        <p>Version 2.0 (mar 2nd 2026): Massive UI change</p>

        <p>Version 1.2 (feb 24th 2026): Add HTML posting option, seperate from rich text</p>

        <p>Version 1.1 (feb 20th 2026): Cloudfare safety/bot protection and Google SSO for safety</p>

        <p>Version 1.0 (feb 20th 2026): Created this project. Has basic upload story and comment functionality, all anon.</p>
      </div>
    </div>
  );
}
