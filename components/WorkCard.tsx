import Link from "next/link";
import TagList from "./TagList";
import { SanitizedWork } from "@/lib/types";

interface WorkCardProps {
  work: SanitizedWork;
}

export default function WorkCard({ work }: WorkCardProps) {
  return (
    <div className="border border-gray-300 rounded bg-white mb-4">
      <div className="p-4">
        <div className="mb-2">
          <Link
            href={`/works/${work.id}`}
            className="text-lg font-bold text-teal-800 hover:underline"
          >
            {work.title}
          </Link>
          <span className="text-gray-600 ml-2">
            by <span className="font-medium">{work.author}</span>
          </span>
        </div>

        <div className="mb-2">
          <TagList
            rating={work.rating}
            fandoms={work.fandoms}
            relationships={work.relationships}
            characters={work.characters}
            freeforms={work.freeforms}
          />
        </div>

        {work.summary && (
          <p className="text-gray-700 text-sm mb-2 line-clamp-3">{work.summary}</p>
        )}

        <div className="text-xs text-gray-500 flex gap-3">
          <span>Words: {work.wordCount.toLocaleString()}</span>
          <span>Chapters: {work.chapterCount}</span>
          <span>Hits: {(work.hitCount || 0).toLocaleString()}</span>
          <span>Kudos: {(work.kudosCount || 0).toLocaleString()}</span>
          <span>{new Date(work.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
