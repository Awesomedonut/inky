import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-gray-600 mb-6">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="px-5 py-2 bg-teal-700 text-white rounded hover:bg-teal-800"
      >
        Go Home
      </Link>
    </div>
  );
}
