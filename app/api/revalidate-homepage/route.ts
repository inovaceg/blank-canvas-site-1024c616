import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Revalida o cache da página inicial
    revalidatePath("/");
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    console.error("[v0] Error revalidating homepage:", error);
    return NextResponse.json({ error: "Failed to revalidate homepage" }, { status: 500 });
  }
}