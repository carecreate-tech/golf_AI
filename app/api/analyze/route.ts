import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildAnalysisPrompt } from "@/lib/analysis";
import { Club } from "@/types/club";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { clubs }: { clubs: Club[] } = await req.json();

  if (!clubs || clubs.length < 2) {
    return NextResponse.json(
      { error: "クラブを2本以上登録してから分析してください" },
      { status: 400 }
    );
  }

  const prompt = buildAnalysisPrompt(clubs);

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  return NextResponse.json({ report: text });
}
