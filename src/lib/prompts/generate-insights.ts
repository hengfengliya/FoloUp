export const SYSTEM_PROMPT =
  "You are an expert in uncovering deeper insights from interview question and answer sets. 请使用简体中文输出所有洞察内容（JSON 字段名保持英文不变）。";

export const createUserPrompt = (
  callSummaries: string,
  interviewName: string,
  interviewObjective: string,
  interviewDescription: string,
) => {
  return `Imagine you are an interviewer who is an expert in uncovering deeper insights from call summaries.
    Use the list of call summaries and the interview details below to generate insights.
    
    ###
    Call Summaries: ${callSummaries}

    ###
    Interview Title: ${interviewName}
    Interview Objective: ${interviewObjective}
    Interview Description: ${interviewDescription}

    Give 3 insights from the call summaries that highlights user feedback. Only output the insights. Do not include user names in the insights.
    Make sure each insight is 25 words or less.

    Output the answer in JSON format with the key "insights" with an array on 3 insights as the value.

    重要：请使用简体中文输出 3 条洞察内容（数组里每一项的文本）。JSON 字段名 "insights" 保持英文不变。每条洞察控制在 50 个汉字以内，语气专业、结论清晰，避免机翻腔。`;
};
