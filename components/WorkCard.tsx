import Link from "next/link";
import { SanitizedWork } from "@/lib/types";

interface WorkCardProps {
  work: SanitizedWork;
}

function ratingClass(rating: string) {
  switch (rating) {
    case "General":
      return "rating-general-audience";
    case "Teen":
      return "rating-teen";
    case "Mature":
      return "rating-mature";
    case "Explicit":
      return "rating-explicit";
    default:
      return "rating-notrated";
  }
}

function commaList(tags: string[], type: string) {
  return tags.map((tag, idx) => (
    <li key={`${type}-${tag}`}>
      <Link href={`/works?tag=${encodeURIComponent(tag)}`}>{tag}</Link>
      {idx < tags.length - 1 ? ", " : ""}
    </li>
  ));
}

export default function WorkCard({ work }: WorkCardProps) {
  return (
    <li id={`work_${work.id}`} className="work blurb group" role="article">
      <div className="header module">
        <ul className="required-tags">
          <li>
            <span className={ratingClass(work.rating)}>
              <span className="text">{work.rating}</span>
            </span>
          </li>
        </ul>

        <h4 className="heading">
          <Link href={`/works/${work.id}`}>{work.title}</Link> by{" "}
          <Link href={`/works?q=${encodeURIComponent(work.author)}`} rel="author">
            {work.author}
          </Link>
        </h4>

        <p className="datetime">{new Date(work.createdAt).toLocaleDateString()}</p>

        <dl className="stats">
          <dt className="words">Words:</dt>
          <dd className="words">{work.wordCount.toLocaleString()}</dd>
          <dt className="chapters">Chapters:</dt>
          <dd className="chapters">{work.chapterCount}</dd>
          <dt className="hits">Hits:</dt>
          <dd className="hits">{(work.hitCount || 0).toLocaleString()}</dd>
          <dt className="kudos">Kudos:</dt>
          <dd className="kudos">{(work.kudosCount || 0).toLocaleString()}</dd>
        </dl>
      </div>

      <h5 className="fandoms heading">Fandoms:</h5>
      <ul className="fandoms commas">{commaList(work.fandoms, "fandom")}</ul>

      {work.relationships.length > 0 && (
        <>
          <h5 className="relationships heading">Relationships:</h5>
          <ul className="relationships commas">{commaList(work.relationships, "relationship")}</ul>
        </>
      )}

      {work.characters.length > 0 && (
        <>
          <h5 className="characters heading">Characters:</h5>
          <ul className="characters commas">{commaList(work.characters, "character")}</ul>
        </>
      )}

      {work.freeforms.length > 0 && (
        <>
          <h5 className="freeforms heading">Additional Tags:</h5>
          <ul className="tags commas">{commaList(work.freeforms, "freeform")}</ul>
        </>
      )}

      {work.summary && (
        <blockquote className="userstuff summary">
          <p>{work.summary}</p>
        </blockquote>
      )}
    </li>
  );
}
