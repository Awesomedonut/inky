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
      <div className="splash">
        <div className="browse module">
          <h3 className="heading">Find Your Favorites</h3>
          <p className="note">
            Browse all posted works or post your own.
          </p>
          <ul className="navigation actions" role="navigation">
            <li><Link href="/works">Browse Works</Link></li>
            <li><Link href="/works/new">Post Work</Link></li>
          </ul>
        </div>

        <div className="random readings module">
          <h3 className="heading">
            <span className="title">Recent Works</span>
            <span className="link"><Link href="/works">View All</Link></span>
          </h3>
          {recent.length === 0 ? (
            <p className="note">No works posted yet.</p>
          ) : (
            <ol className="reading work index group">
              {recent.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
