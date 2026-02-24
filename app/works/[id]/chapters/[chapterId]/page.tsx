import { notFound } from "next/navigation";
import { getWork, getChapter, getChaptersForWork } from "@/lib/store";
import ChapterNav from "@/components/ChapterNav";
import CommentSection from "@/components/CommentSection";
import HitTracker from "@/components/HitTracker";
import FormattedText from "@/components/FormattedText";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>;
}) {
  const { id, chapterId } = await params;
  const work = await getWork(id);
  if (!work) notFound();

  const chapter = await getChapter(chapterId);
  if (!chapter || chapter.workId !== id) notFound();

  const chapters = await getChaptersForWork(id);

  return (
    <div className="max-w-4xl mx-auto">
      <HitTracker workId={id} />
      {/* Work title breadcrumb */}
      <div className="mb-4">
        <Link href={`/works/${id}`} className="text-teal-700 hover:underline text-sm">
          &laquo; {work.title}
        </Link>
        <span className="text-gray-400 text-sm mx-2">by {work.author}</span>
      </div>

      {/* Chapter navigation (top) */}
      <ChapterNav
        workId={id}
        chapters={chapters.map((c) => ({
          id: c.id,
          title: c.title,
          position: c.position,
        }))}
        currentPosition={chapter.position}
      />

      {/* Chapter content */}
      <div className="bg-white border border-gray-300 rounded p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {chapter.title || `Chapter ${chapter.position}`}
        </h2>
        <div className="prose max-w-none whitespace-pre-wrap text-gray-800 leading-relaxed">
          <FormattedText
            text={chapter.body}
            format={chapter.format || "rich_text"}
          />
        </div>
      </div>

      {/* Chapter navigation (bottom) */}
      <ChapterNav
        workId={id}
        chapters={chapters.map((c) => ({
          id: c.id,
          title: c.title,
          position: c.position,
        }))}
        currentPosition={chapter.position}
      />

      {/* Comments */}
      <CommentSection workId={id} />
    </div>
  );
}
