import { NextRequest, NextResponse } from "next/server";
import { incrementKudos } from "@/lib/store";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const kudosCount = await incrementKudos(id);

  if (kudosCount === undefined) {
    return NextResponse.json({ error: "Work not found" }, { status: 404 });
  }

  return NextResponse.json({ kudosCount });
}
