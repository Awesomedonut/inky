export default function DevlogPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white border border-gray-300 rounded p-6">
        <h1 className="text-2xl font-bold text-teal-900 mb-4">Devlog</h1>

        <div className="prose max-w-none text-gray-700 space-y-4">
        </div>

        <p>Version 1.1 (feb 20th 2026): Cloudfare safety/bot protection and Google SSO for safety</p>

        <p>Version 1.0 (feb 20th 2026): Created this project. Has basic upload story and comment functionality, all anon.</p>
      </div>
    </div>
  );
}
