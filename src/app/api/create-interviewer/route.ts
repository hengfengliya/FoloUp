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

  try {
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

    // Create Lisa
    const newFirstAgent = await retellClient.agent.create({
      response_engine: { llm_id: newModel.llm_id, type: "retell-llm" },
      voice_id: "minimax-May",
      agent_name: "Lisa",
      language: "zh-CN",
    });

    const newInterviewer = await InterviewerService.createInterviewer({
      agent_id: newFirstAgent.agent_id,
      ...INTERVIEWERS.LISA,
    });

    // Create Bob
    const newSecondAgent = await retellClient.agent.create({
      response_engine: { llm_id: newModel.llm_id, type: "retell-llm" },
      voice_id: "minimax-Kevin",
      agent_name: "Bob",
      language: "zh-CN",
    });

    const newSecondInterviewer = await InterviewerService.createInterviewer({
      agent_id: newSecondAgent.agent_id,
      ...INTERVIEWERS.BOB,
    });

    logger.info("");

    return NextResponse.json(
      {
        newInterviewer,
        newSecondInterviewer,
      },
      { status: 200 },
    );
  } catch (error) {
    const err = error as Error;
    logger.error(`Error creating interviewers: ${err?.message || String(error)}`);
    console.error("create-interviewer full error:", error);

    return NextResponse.json(
      { error: "Failed to create interviewers", detail: err?.message || String(error) },
      { status: 500 },
    );
  }
}
