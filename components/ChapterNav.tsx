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
    <ul className="chapter navigation actions" role="navigation">
      <li>
        {prev ? (
          <Link href={`/works/${workId}/chapters/${prev.id}`}>&laquo; Previous Chapter</Link>
        ) : (
          <span>&laquo; Previous Chapter</span>
        )}
      </li>
      <li>Chapter {currentPosition} of {chapters.length}</li>
      <li>
        {next ? (
          <Link href={`/works/${workId}/chapters/${next.id}`}>Next Chapter &raquo;</Link>
        ) : (
          <span>Next Chapter &raquo;</span>
        )}
      </li>
    </ul>
  );
}
