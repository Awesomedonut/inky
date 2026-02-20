import Link from "next/link";
import { getWorks } from "@/lib/store";
import WorkCard from "@/components/WorkCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const works = await getWorks();
  const recent = works
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20);

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-teal-900 mb-2">
          Welcome to Inky
        </h1>
        <p className="text-gray-600 mb-4">
          A writing archive
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/works/new"
            className="px-5 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 font-semibold"
          >
            Post a Work
          </Link>
          <Link
            href="/works"
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold"
          >
            Browse Works
          </Link>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Works</h2>

      {recent.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded">
          <p className="text-gray-500 mb-3">No works yet.</p>
          <Link
            href="/works/new"
            className="text-teal-700 hover:underline font-semibold"
          >
            Be the first to post!
          </Link>
        </div>
      ) : (
        <div>
          {recent.map((work) => (
            <WorkCard key={work.id} {...work} />
          ))}
        </div>
      )}
    </div>
  );
}
