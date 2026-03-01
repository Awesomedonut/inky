"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import WorkCard from "@/components/WorkCard";
import TagFilter from "@/components/TagFilter";
import { SanitizedWork } from "@/lib/types";

function buildWorksUrl(filters: { tag?: string; q?: string; page?: number }) {
  const params = new URLSearchParams();
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.q) params.set("q", filters.q);
  if (filters.page) params.set("page", String(filters.page));
  return `/works?${params.toString()}`;
}

function BrowseWorksInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tag = searchParams.get("tag") || "";
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [works, setWorks] = useState<SanitizedWork[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(q);

  useEffect(() => {
    fetch(`/api/works?${new URLSearchParams({ ...(tag && { tag }), ...(q && { q }), page: String(page) }).toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setWorks(data.works || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      })
      .catch(() => {});
  }, [tag, q, page]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildWorksUrl({ tag, q: search.trim() }));
  }

  return (
    <div className="works-index">
      <h2 className="heading">Works</h2>
      <h3 className="heading">
        Found {total} work{total !== 1 ? "s" : ""}
      </h3>

      <fieldset className="form">
        <legend>Search Works</legend>
        <form onSubmit={handleSearch}>
          <p>
            <label htmlFor="work-search">Search:</label>
            <input
              id="work-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Title, summary, or author"
            />
            <button type="submit">Search</button>
          </p>
        </form>
      </fieldset>

      <TagFilter />

      {tag && <p className="notice">Filtering by tag: {tag}</p>}

      {works.length === 0 ? (
        <p className="notice">No works found.</p>
      ) : (
        <ol className="work index group">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </ol>
      )}

      {totalPages > 1 && (
        <ul className="pagination actions">
          {page > 1 && (
            <li>
              <button onClick={() => router.push(buildWorksUrl({ tag, q, page: page - 1 }))}>
                Previous
              </button>
            </li>
          )}
          <li>Page {page} of {totalPages}</li>
          {page < totalPages && (
            <li>
              <button onClick={() => router.push(buildWorksUrl({ tag, q, page: page + 1 }))}>
                Next
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default function BrowseWorksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowseWorksInner />
    </Suspense>
  );
}
