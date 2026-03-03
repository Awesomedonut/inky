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
  const nextChapter = chapters.length > 1 ? chapters[1] : null;

  return (
    <div className="work show region">
      <HitTracker workId={id} />

      <div className="work">
        <h3 className="landmark heading">Actions</h3>
        <ul className="work navigation actions">
          <li className="chapter entire"><Link href={`/works/${id}`}>Entire Work</Link></li>
          {nextChapter && (
            <li className="chapter next">
              <Link href={`/works/${id}/chapters/${nextChapter.id}`}>Next Chapter &raquo;</Link>
            </li>
          )}
          {chapters.length > 1 && (
            <li className="chapter"><a href="#chapter_index">Chapter Index</a></li>
          )}
          <li className="comments"><a href="#comments">Comments</a></li>
          <li className="edit"><Link href={`/works/${id}/edit`}>Edit</Link></li>
          <li className="add"><Link href={`/works/${id}/chapters/new`}>Add Chapter</Link></li>
          <li className="kudos"><KudosButton workId={id} initialCount={work.kudosCount || 0} /></li>
        </ul>

        <div className="wrapper">
          <dl className="work meta group">
            <TagList
              rating={work.rating}
              fandoms={work.fandoms}
              relationships={work.relationships}
              characters={work.characters}
              freeforms={work.freeforms}
            />
            <dt className="language">Language:</dt>
            <dd className="language">English</dd>
            <dt className="stats">Stats:</dt>
            <dd className="stats">
              <dl className="stats">
                <dt className="words">Words:</dt>
                <dd className="words">{work.wordCount.toLocaleString()}</dd>
                <dt className="chapters">Chapters:</dt>
                <dd className="chapters">{work.chapterCount}/{work.chapterCount}</dd>
                <dt className="kudos">Kudos:</dt>
                <dd className="kudos">{(work.kudosCount || 0).toLocaleString()}</dd>
                <dt className="hits">Hits:</dt>
                <dd className="hits">{(work.hitCount || 0).toLocaleString()}</dd>
              </dl>
            </dd>
          </dl>
        </div>

        <div id="workskin">
          <div className="preface group">
            <h2 className="title heading">{work.title}</h2>
            <h3 className="byline heading">{work.author}</h3>
            {work.summary && (
              <div className="summary module">
                <h3 className="heading">Summary:</h3>
                <blockquote className="userstuff">
                  <p>{work.summary}</p>
                </blockquote>
              </div>
            )}
          </div>

          {chapters.length > 1 && (
            <div className="chapter index group" id="chapter_index">
              <h3 className="heading">Chapter Index</h3>
              <ol>
                {chapters.map((ch) => (
                  <li key={ch.id}>
                    <Link href={`/works/${id}/chapters/${ch.id}`}>
                      {ch.title || `Chapter ${ch.position}`}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <ChapterNav workId={id} chapters={chapters} currentPosition={1} />

          {firstChapter && (
            <div className="chapter" id={`chapter-${firstChapter.id}`}>
              {firstChapter.title && <h3 className="title">{firstChapter.title}</h3>}
              <div className="userstuff">
                <FormattedText
                  text={firstChapter.body}
                  format={firstChapter.format || "rich_text"}
                />
              </div>
            </div>
          )}

          <ChapterNav workId={id} chapters={chapters} currentPosition={1} />
          </div>
      </div>
      <CommentSection workId={id} />
    </div>
  );
}
