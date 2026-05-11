import { logger } from "@/lib/logger";
import { SYSTEM_PROMPT, generateQuestionsPrompt } from "@/lib/prompts/generate-questions";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export const maxDuration = 60;

export async function POST(req: Request) {
  logger.info("generate-interview-questions request received");
  const body = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
    maxRetries: 5,
    dangerouslyAllowBrowser: true,
  });

  try {
    const baseCompletion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: generateQuestionsPrompt(body),
        },
      ],
      response_format: { type: "json_object" },
    });

    const basePromptOutput = baseCompletion.choices[0] || {};
    const content = basePromptOutput.message?.content;

    logger.info("Interview questions generated successfully");

    return NextResponse.json(
      {
        response: content,
      },
      { status: 200 },
    );
  } catch (error) {
    const err = error as any;
    const detail = {
      message: err?.message,
      name: err?.name,
      status: err?.status,
      code: err?.code,
      causeMessage: err?.cause?.message,
      responseBody:
        typeof err?.response?.data === "string"
          ? err.response.data.slice(0, 300)
          : JSON.stringify(err?.response?.data || err?.error || {}).slice(0, 300),
    };
    logger.error(`Error generating interview questions: ${JSON.stringify(detail)}`);

    return NextResponse.json({ error: "internal server error", detail }, { status: 500 });
  }
}
