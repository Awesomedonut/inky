import { notFound } from "next/navigation";
import Link from "next/link";
import { getWork, getChaptersForWork } from "@/lib/store";
import ChapterNav from "@/components/ChapterNav";
import CommentSection from "@/components/CommentSection";
import KudosButton from "@/components/KudosButton";
import HitTracker from "@/components/HitTracker";
import FormattedText from "@/components/FormattedText";
import TagList from "@/components/TagList";

export const dynamic = "force-dynamic";

export default async function WorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const work = await getWork(id);
  if (!work) notFound();

  const chapters = await getChaptersForWork(id);
  const firstChapter = chapters[0];

  return (
    <div className="max-w-4xl mx-auto">
      <HitTracker workId={id} />
      {/* Work header */}
      <div className="bg-white border border-gray-300 rounded p-6 mb-6">
        <h1 className="text-2xl font-bold text-teal-900 mb-1">{work.title}</h1>
        <p className="text-gray-600 mb-3">
          by <span className="font-medium">{work.author}</span>
        </p>

        {/* Tags */}
        <div className="mb-3">
          <TagList
            rating={work.rating}
            fandoms={work.fandoms}
            relationships={work.relationships}
            characters={work.characters}
            freeforms={work.freeforms}
          />
        </div>

        {/* Summary */}
        {work.summary && (
          <div className="text-gray-700 text-sm mb-3">
            <strong>Summary:</strong>
            <p className="mt-1">{work.summary}</p>
          </div>
        )}

        {/* Stats */}
        <div className="text-xs text-gray-500 flex gap-3">
          <span>Words: {work.wordCount.toLocaleString()}</span>
          <span>Chapters: {work.chapterCount}</span>
          <span>Hits: {(work.hitCount || 0).toLocaleString()}</span>
          <span>Kudos: {(work.kudosCount || 0).toLocaleString()}</span>
          <span>Published: {new Date(work.createdAt).toLocaleDateString()}</span>
          {work.updatedAt !== work.createdAt && (
            <span>
              Updated: {new Date(work.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
          <KudosButton workId={id} initialCount={work.kudosCount || 0} />
          <Link
            href={`/works/${id}/edit`}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
          >
            Edit Work
          </Link>
          <Link
            href={`/works/${id}/chapters/new`}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
          >
            Add Chapter
          </Link>
        </div>
      </div>

      {/* Chapter index (if multi-chapter) */}
      {chapters.length > 1 && (
        <div className="bg-white border border-gray-300 rounded p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Chapters</h3>
          <ol className="list-decimal list-inside text-sm space-y-1">
            {chapters.map((ch) => (
              <li key={ch.id}>
                <Link
                  href={`/works/${id}/chapters/${ch.id}`}
                  className="text-teal-700 hover:underline"
                >
                  {ch.title || `Chapter ${ch.position}`}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Chapter navigation */}
      <ChapterNav workId={id} chapters={chapters} currentPosition={1} />

      {/* Chapter content */}
      {firstChapter && (
        <div className="bg-white border border-gray-300 rounded p-6 mb-6">
          {firstChapter.title && (
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {firstChapter.title}
            </h2>
          )}
          <div className="prose max-w-none whitespace-pre-wrap text-gray-800 leading-relaxed">
            <FormattedText
              text={firstChapter.body}
              format={firstChapter.format || "rich_text"}
            />
          </div>
        </div>
      )}

      {/* Chapter navigation (bottom) */}
      <ChapterNav workId={id} chapters={chapters} currentPosition={1} />

      {/* Comments */}
      <CommentSection workId={id} />
    </div>
  );
}
