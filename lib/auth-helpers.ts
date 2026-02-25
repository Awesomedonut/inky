import { NextResponse } from "next/server";
import { getWork, hashToken } from "./store";
import { Work } from "./types";

type VerifyResult =
  | { ok: true; work: Work }
  | { ok: false; response: NextResponse };

export async function verifyEditToken(
  workId: string,
  editToken: string | undefined
): Promise<VerifyResult> {
  if (!editToken) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Edit token required" }, { status: 401 }),
    };
  }

  const work = await getWork(workId);
  if (!work) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Work not found" }, { status: 404 }),
    };
  }

  if (hashToken(editToken) !== work.editToken) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid edit token" }, { status: 403 }),
    };
  }

  return { ok: true, work };
}
