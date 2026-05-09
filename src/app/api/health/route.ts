import { NextResponse } from "next/server";

export async function GET() {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const bufferConfigured = Boolean(process.env.BUFFER_ACCESS_TOKEN);
  const aiConfigured = Boolean(process.env.OPENAI_API_KEY || process.env.AI_PROVIDER_KEY);

  return NextResponse.json({ supabaseConfigured, bufferConfigured, aiConfigured });
}
