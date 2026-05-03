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

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return n.toString();
}

export default function WorkCard({ work }: WorkCardProps) {
  const allTags = [
    ...work.fandoms,
    ...work.relationships.slice(0, 2),
    ...work.freeforms.slice(0, 3),
  ];

  return (
    <article className="work-card" id={`work_${work.id}`}>
      <div className="work-card-inner">
        <div className="work-card-head">
          <span className={`work-rating ${ratingClass(work.rating)}`}>
            {work.rating}
          </span>
          <span className="work-meta-sep">·</span>
          <span className="work-fandom">
            {work.fandoms.slice(0, 2).map((f, i) => (
              <span key={f}>
                <Link href={`/works?tag=${encodeURIComponent(f)}`}>{f}</Link>
                {i < Math.min(work.fandoms.length, 2) - 1 ? ", " : ""}
              </span>
            ))}
          </span>
        </div>

        <h3 className="work-title">
          <Link href={`/works/${work.id}`}>{work.title}</Link>
        </h3>

        <p className="work-byline">
          by{" "}
          <Link href={`/works?q=${encodeURIComponent(work.author)}`}>
            {work.author}
          </Link>
        </p>

        {work.summary && (
          <p className="work-summary">{work.summary}</p>
        )}

        <div className="work-tags">
          {allTags.slice(0, 5).map((tag) => (
            <Link
              key={tag}
              href={`/works?tag=${encodeURIComponent(tag)}`}
              className="work-tag"
            >
              {tag}
            </Link>
          ))}
        </div>

        <div className="work-stats">
          <span>{formatCount(work.wordCount)} words</span>
          <span>{work.chapterCount} ch</span>
          <span>{formatCount(work.kudosCount || 0)} kudos</span>
          <time dateTime={work.createdAt}>
            {new Date(work.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>
      </div>
    </article>
  );
}
