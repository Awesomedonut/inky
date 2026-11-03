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

  return (
    <div className="works-index">
      <h2 className="heading">{total} work{total !== 1 ? "s" : ""}</h2>

      <TagFilter />

      {tag && <p className="notice">Filtering by tag: {tag}</p>}

      {works.length === 0 ? (
        <p className="empty-state">No works found.</p>
      ) : (
        <div className="work-grid">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
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
