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
    <div className="flex gap-6 flex-col md:flex-row">
      {/* Sidebar */}
      <div className="md:w-64 flex-shrink-0">
        <TagFilter />
      </div>

      {/* Main content */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Browse Works</h1>
          <span className="text-sm text-gray-500">
            {total} work{total !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-4 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, summary, or author..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-teal-700 text-white rounded text-sm hover:bg-teal-800"
          >
            Search
          </button>
        </form>

        {tag && (
          <div className="mb-4 text-sm text-gray-600">
            Filtering by tag: <span className="font-semibold">{tag}</span>
          </div>
        )}

        {works.length === 0 ? (
          <div className="text-center py-8 bg-white border border-gray-200 rounded">
            <p className="text-gray-500">No works found.</p>
          </div>
        ) : (
          <>
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {page > 1 && (
                  <button
                    onClick={() => router.push(buildWorksUrl({ tag, q, page: page - 1 }))}
                    className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                  >
                    Previous
                  </button>
                )}
                <span className="px-3 py-1 text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <button
                    onClick={() => router.push(buildWorksUrl({ tag, q, page: page + 1 }))}
                    className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                  >
                    Next
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function BrowseWorksPage() {
  return (
    <Suspense fallback={<div className="text-center py-8 text-gray-500">Loading...</div>}>
      <BrowseWorksInner />
    </Suspense>
  );
}
