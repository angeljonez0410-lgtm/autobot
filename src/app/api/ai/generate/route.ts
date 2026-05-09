import { NextResponse } from "next/server";
import { CONTENT_TEMPLATES } from "@/lib/data";

type Payload = {
  platform?: string;
  category?: string;
  goal?: string;
  contentType?: string;
  voice?: string;
  customPrompt?: string;
};

function buildDemoResponse(payload: Payload) {
  const template = CONTENT_TEMPLATES.find((tpl) =>
    payload.category ? tpl.category.toLowerCase().includes(payload.category.toLowerCase().split(" ")[0]) : true,
  );

  const contentType = payload.contentType ?? "social post";
  const goal = payload.goal ?? "drive engagement";

  return `${template?.hook ?? "Stop scrolling, this is your sign to launch."}\n\n${
    template?.body ?? "Show proof, share your offer, and add urgency with honesty."
  }\n\nType: ${contentType}\nGoal: ${goal}\n\n${template?.cta ?? "DM READY"}\n${(template?.hashtags ?? ["#Mompreneur", "#MakeMoneyTonight"]).join(" ")}`;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Payload;
    const apiKey = process.env.OPENAI_API_KEY || process.env.AI_PROVIDER_KEY;

    if (!apiKey) {
      return NextResponse.json({ demoMode: true, text: buildDemoResponse(payload) });
    }

    const prompt = payload.customPrompt
      ? payload.customPrompt
      : `Generate ${payload.contentType} for ${payload.platform}. Category: ${payload.category}. Goal: ${payload.goal}. Voice: ${payload.voice}. Keep it beginner-friendly, motivational, and not scammy.`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message ?? "AI generation failed" }, { status: 500 });
    }

    const text = data.output_text || buildDemoResponse(payload);
    return NextResponse.json({ demoMode: false, text });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not generate content" },
      { status: 500 },
    );
  }
}
