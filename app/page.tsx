import Link from "next/link";
import { getWorks } from "@/lib/store";
import WorkCard from "@/components/WorkCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const works = await getWorks();
  const recent = works
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 12);

  return (
    <div className="home">
      <section className="hero">
        <p className="hero-sub">
          A place to post, discover, and share creative writing.
        </p>
        <div className="hero-actions">
          <Link href="/works" className="btn-primary">Browse works</Link>
          <Link href="/works/new" className="btn-secondary">Post something</Link>
        </div>
      </section>

      <section className="recent-section">
        <div className="section-head">
          <h2>Recent</h2>
          <Link href="/works" className="section-link">View all →</Link>
        </div>
        {recent.length === 0 ? (
          <p className="empty-state">No works posted yet. Be the first.</p>
        ) : (
          <div className="work-grid">
            {recent.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
