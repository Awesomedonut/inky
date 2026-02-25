import Link from "next/link";
import { Chapter } from "@/lib/types";

interface ChapterNavProps {
  workId: string;
  chapters: Pick<Chapter, "id" | "title" | "position">[];
  currentPosition: number;
}

export default function ChapterNav({
  workId,
  chapters,
  currentPosition,
}: ChapterNavProps) {
  if (chapters.length <= 1) return null;

  const sorted = [...chapters].sort((a, b) => a.position - b.position);
  const currentIdx = sorted.findIndex((c) => c.position === currentPosition);
  const prev = currentIdx > 0 ? sorted[currentIdx - 1] : null;
  const next = currentIdx < sorted.length - 1 ? sorted[currentIdx + 1] : null;

  return (
    <div className="flex items-center justify-between py-3 border-t border-b border-gray-200 my-4">
      <div>
        {prev ? (
          <Link
            href={`/works/${workId}/chapters/${prev.id}`}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            &laquo; Previous
          </Link>
        ) : (
          <span className="px-3 py-1.5 text-gray-400 text-sm">
            &laquo; Previous
          </span>
        )}
      </div>

      <div className="text-sm text-gray-600">
        Chapter {currentPosition} of {chapters.length}
      </div>

      <div>
        {next ? (
          <Link
            href={`/works/${workId}/chapters/${next.id}`}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            Next &raquo;
          </Link>
        ) : (
          <span className="px-3 py-1.5 text-gray-400 text-sm">
            Next &raquo;
          </span>
        )}
      </div>
    </div>
  );
}
