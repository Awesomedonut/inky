import { NextRequest, NextResponse } from "next/server";
import { getAllTags } from "@/lib/store";
import { TagType } from "@/lib/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") as TagType | null;
  const q = searchParams.get("q");

  const allTags = await getAllTags();

  if (type && type in allTags) {
    let tags = allTags[type];
    if (q) {
      const qLower = q.toLowerCase();
      tags = tags.filter((t) => t.toLowerCase().includes(qLower));
    }
    return NextResponse.json({ tags });
  }

  // If no type specified, return all tags (optionally filtered by q)
  if (q) {
    const qLower = q.toLowerCase();
    const filtered: Record<string, string[]> = {};
    for (const [key, tags] of Object.entries(allTags)) {
      filtered[key] = tags.filter((t) => t.toLowerCase().includes(qLower));
    }
    return NextResponse.json(filtered);
  }

  return NextResponse.json(allTags);
}
