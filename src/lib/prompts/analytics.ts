export const SYSTEM_PROMPT =
  "You are an expert in analyzing interview transcripts. You must only use the main questions provided and not generate or infer additional questions. 请使用简体中文输出所有评分反馈、问题总结和软技能描述（JSON 字段名保持英文不变）。";

export const getInterviewAnalyticsPrompt = (
  interviewTranscript: string,
  mainInterviewQuestions: string,
) => `Analyse the following interview transcript and provide structured feedback:

###
Transcript: ${interviewTranscript}

Main Interview Questions:
${mainInterviewQuestions}


Based on this transcript and the provided main interview questions, generate the following analytics in JSON format:
1. Overall Score (0-100) and Overall Feedback (60 words) - take into account the following factors:
   - Communication Skills: Evaluate the use of language, grammar, and vocabulary. Assess if the interviewee communicated effectively and clearly.
   - Time Taken to Answer: Consider if the interviewee answered promptly or took too long. Note if they were concise or tended to ramble.
   - Confidence: Assess the interviewee's confidence level. Were they assertive and self-assured, or did they seem hesitant and unsure?
   - Clarity: Evaluate the clarity of their answers. Were their responses well-structured and easy to understand?
   - Attitude: Consider the interviewee's attitude towards the interview and questions. Were they positive, respectful, and engaged?
   - Relevance of Answers: Determine if the interviewee's responses are relevant to the questions asked. Assess if they stayed on topic or veered off track.
   - Depth of Knowledge: Evaluate the interviewee's depth of understanding and knowledge in the subject matter. Look for detailed and insightful answers.
   - Problem-Solving Ability: Consider how the interviewee approaches problem-solving questions. Assess their logical reasoning and analytical skills.
   - Examples and Evidence: Note if the interviewee provides concrete examples or evidence to support their answers. This can indicate experience and credibility.
   - Listening Skills: Look for signs that the interviewee is actively listening and responding appropriately to follow-up questions.
   - Consistency: Evaluate if the interviewee's answers are consistent throughout the interview or if they contradict themselves.
   - Adaptability: Assess how well the interviewee adapts to different types of questions, including unexpected or challenging ones.

2. Communication Skills: Score (0-10) and Feedback (60 words). Rating system and guidelines for communication skills is as following (评估候选人使用中文进行表达和沟通的能力).
    - 10: 完全熟练的语言运用，措辞得体、准确、流畅，表现出完全的理解能力。
    - 09: 完全熟练的语言运用，偶有不准确或表述不当；面对陌生场景可能出现误解，但能很好地处理复杂论述。
    - 08: 可熟练运用语言，偶有不准确、表述不当或误解；能很好地处理复杂语言和详细推理。
    - 07: 语言运用有效，尽管存在一些不准确、表述不当或误解；在熟悉场景下能够使用并理解相对复杂的语言。
    - 06: 部分掌握语言，能把握整体意思，但错误较多；在自己熟悉的领域可以完成基本沟通。
    - 05: 仅具备基本沟通能力，局限于熟悉场景，理解和表达上经常出现问题。
    - 04: 仅能在非常熟悉的场景下理解大致意思，沟通经常中断。
    - 03: 在听懂口头表达上存在很大困难。
    - 02: 几乎无法使用该语言，仅能使用零星的几个词。
    - 01: 未回答任何问题。
3. Summary for each main interview question: ${mainInterviewQuestions}
   - Use ONLY the main questions provided, it should output all the questions with the numbers even if it's not found in the transcript.
   - Follow the below rules when outputing the question and summary
      - If a main interview question isn't found in the transcript, then output the main question and give the summary as "Not Asked"
      - If a main interview question is found in the transcript but an answer couldn't be found, then output the main question and give the summary as "Not Answered"
      - If a main interview question is found in the transcript and an answer can also be found, then,
          - For each main question (q), provide a summary that includes:
            a) The candidate's response to the main question
            b) Any follow-up questions that were asked related to this main question and their answers
          - The summary should be a cohesive paragraph encompassing all related information for each main question
4. Create a 10 to 15 words summary regarding the soft skills considering factors such as confidence, leadership, adaptability, critical thinking and decision making.
Ensure the output is in valid JSON format with the following structure:
{
  "overallScore": number,
  "overallFeedback": string,
  "communication": { "score": number, "feedback": string },
  "questionSummaries": [{ "question": string, "summary": string }],
  "softSkillSummary: string
}

IMPORTANT: Only use the main questions provided. Do not generate or infer additional questions such as follow-up questions.

重要：请使用简体中文撰写以下所有文本内容：
- overallFeedback（整体反馈）
- communication.feedback（沟通能力反馈）
- questionSummaries[].summary（每个问题的总结，包括"Not Asked"翻译为"未提问"、"Not Answered"翻译为"未回答"）
- softSkillSummary（软技能总结）

JSON 字段名（overallScore、overallFeedback、communication、score、feedback、questionSummaries、question、summary、softSkillSummary）必须保持英文原样。questionSummaries 数组中的 question 字段应原样保留主问题文本（不做改动）。所有中文输出语气专业、结论清晰，避免机翻腔。`;
