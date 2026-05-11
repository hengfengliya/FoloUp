import { INTERVIEWERS, RETELL_AGENT_GENERAL_PROMPT } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { InterviewerService } from "@/services/interviewers.service";
import { type NextRequest, NextResponse } from "next/server";
import Retell from "retell-sdk";

const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
});

export async function GET(res: NextRequest) {
  logger.info("create-interviewer request received");
  logger.info(`RETELL_API_KEY length: ${(process.env.RETELL_API_KEY || "").length}`);

  try {
    logger.info("Step 1: creating retell LLM...");
    const newModel = await retellClient.llm.create({
      model: "gpt-4o",
      general_prompt: RETELL_AGENT_GENERAL_PROMPT,
      general_tools: [
        {
          type: "end_call",
          name: "end_call_1",
          description:
            "End the call if the user uses goodbye phrases such as 'bye,' 'goodbye,' or 'have a nice day.' ",
        },
      ],
    });
    logger.info(`Step 1 OK: llm_id=${newModel.llm_id}`);

    logger.info("Step 2: creating Lisa agent...");
    const newFirstAgent = await retellClient.agent.create({
      response_engine: { llm_id: newModel.llm_id, type: "retell-llm" },
      voice_id: "minimax-May",
      agent_name: "Lisa",
      language: "zh-CN",
    });
    logger.info(`Step 2 OK: agent_id=${newFirstAgent.agent_id}`);

    logger.info("Step 3: saving Lisa to supabase...");
    const newInterviewer = await InterviewerService.createInterviewer({
      agent_id: newFirstAgent.agent_id,
      ...INTERVIEWERS.LISA,
    });
    logger.info(`Step 3 OK: ${JSON.stringify(newInterviewer)?.slice(0, 100)}`);

    logger.info("Step 4: creating Bob agent...");
    const newSecondAgent = await retellClient.agent.create({
      response_engine: { llm_id: newModel.llm_id, type: "retell-llm" },
      voice_id: "minimax-Kevin",
      agent_name: "Bob",
      language: "zh-CN",
    });
    logger.info(`Step 4 OK: agent_id=${newSecondAgent.agent_id}`);

    logger.info("Step 5: saving Bob to supabase...");
    const newSecondInterviewer = await InterviewerService.createInterviewer({
      agent_id: newSecondAgent.agent_id,
      ...INTERVIEWERS.BOB,
    });
    logger.info(`Step 5 OK: ${JSON.stringify(newSecondInterviewer)?.slice(0, 100)}`);

    return NextResponse.json(
      {
        newInterviewer,
        newSecondInterviewer,
      },
      { status: 200 },
    );
  } catch (error) {
    const err = error as any;
    const cause = err?.cause;
    const detail = {
      message: err?.message || String(error),
      name: err?.name,
      status: err?.status,
      code: err?.code,
      causeMessage: cause?.message,
      causeCode: cause?.code,
      causeErrno: cause?.errno,
      stack: err?.stack?.split("\n").slice(0, 5).join(" | "),
    };
    logger.error(`Error creating interviewers: ${JSON.stringify(detail)}`);

    return NextResponse.json(
      { error: "Failed to create interviewers", detail },
      { status: 500 },
    );
  }
}
