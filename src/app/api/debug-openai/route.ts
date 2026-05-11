import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export const maxDuration = 60;

export async function GET() {
  const env = {
    OPENAI_API_KEY_len: (process.env.OPENAI_API_KEY || "").length,
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
  };

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || undefined,
      maxRetries: 0,
    });

    const r = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [{ role: "user", content: '请返回 JSON: {"ok":true}' }],
      response_format: { type: "json_object" },
    });

    return NextResponse.json({ env, raw: r });
  } catch (error) {
    const err = error as any;
    return NextResponse.json({
      env,
      error: {
        message: err?.message,
        name: err?.name,
        status: err?.status,
        code: err?.code,
        causeMessage: err?.cause?.message,
        stack: err?.stack?.split("\n").slice(0, 8),
      },
    }, { status: 500 });
  }
}
