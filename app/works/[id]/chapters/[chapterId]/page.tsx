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
    <div className="work chapter-show">
      <HitTracker workId={id} />
      <p className="navigation">
        <Link href={`/works/${id}`}>&laquo; {work.title}</Link>
      </p>

      <ChapterNav workId={id} chapters={chapters} currentPosition={chapter.position} />

      <div className="chapter" id={`chapter-${chapter.id}`}>
        <h3 className="title">{chapter.title || `Chapter ${chapter.position}`}</h3>
        <div className="userstuff">
          <FormattedText
            text={chapter.body}
            format={chapter.format || "rich_text"}
          />
        </div>
      </div>

      <ChapterNav workId={id} chapters={chapters} currentPosition={chapter.position} />
      <CommentSection workId={id} />
    </div>
  );
}
