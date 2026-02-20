import Link from "next/link";

interface WorkCardProps {
  id: string;
  title: string;
  author: string;
  rating: string;
  fandoms: string[];
  relationships: string[];
  characters: string[];
  freeforms: string[];
  summary: string;
  wordCount: number;
  chapterCount: number;
  createdAt: string;
}

const ratingColors: Record<string, string> = {
  General: "bg-green-600",
  Teen: "bg-yellow-500",
  Mature: "bg-orange-500",
  Explicit: "bg-red-700",
  "Not Rated": "bg-gray-500",
};

export default function WorkCard({
  id,
  title,
  author,
  rating,
  fandoms,
  relationships,
  characters,
  freeforms,
  summary,
  wordCount,
  chapterCount,
  createdAt,
}: WorkCardProps) {
  return (
    <div className="border border-gray-300 rounded bg-white mb-4">
      <div className="p-4">
        {/* Title and author */}
        <div className="mb-2">
          <Link
            href={`/works/${id}`}
            className="text-lg font-bold text-teal-800 hover:underline"
          >
            {title}
          </Link>
          <span className="text-gray-600 ml-2">
            by <span className="font-medium">{author}</span>
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2 text-sm">
          <span
            className={`px-2 py-0.5 rounded text-white text-xs font-semibold ${ratingColors[rating] || "bg-gray-500"}`}
          >
            {rating}
          </span>
          {fandoms.map((tag) => (
            <Link
              key={tag}
              href={`/works?tag=${encodeURIComponent(tag)}`}
              className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded hover:bg-teal-200"
            >
              {tag}
            </Link>
          ))}
          {relationships.map((tag) => (
            <Link
              key={tag}
              href={`/works?tag=${encodeURIComponent(tag)}`}
              className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
            >
              {tag}
            </Link>
          ))}
          {characters.map((tag) => (
            <Link
              key={tag}
              href={`/works?tag=${encodeURIComponent(tag)}`}
              className="px-2 py-0.5 bg-green-100 text-green-800 rounded hover:bg-green-200"
            >
              {tag}
            </Link>
          ))}
          {freeforms.map((tag) => (
            <Link
              key={tag}
              href={`/works?tag=${encodeURIComponent(tag)}`}
              className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* Summary */}
        {summary && (
          <p className="text-gray-700 text-sm mb-2 line-clamp-3">{summary}</p>
        )}

        {/* Meta */}
        <div className="text-xs text-gray-500 flex gap-3">
          <span>Words: {wordCount.toLocaleString()}</span>
          <span>Chapters: {chapterCount}</span>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
