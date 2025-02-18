import { env } from "@/env";
import { getUserMemberInfo } from "@/server/actions/family-actions";
import { generateFamilyTreeByUserId } from "@/server/actions/tree-actions";
import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { promises as fs } from "fs";

const groq = createGroq({
  apiKey: env.GROQ_API_KEY,
});

// export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = await fs.readFile(
    process.cwd() + "/src/app/systemPrompt.md",
    "utf8",
  );
  const userMemberInfo = await getUserMemberInfo();

  const familyTree = await generateFamilyTreeByUserId();

  if (!familyTree) return new Response(null, { status: 404 });

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    messages,
    maxTokens: 4096,
    system:
      systemPrompt +
      "\n\n **Family Tree:** " +
      JSON.stringify(familyTree) +
      "\n\n **Current User:** " +
      JSON.stringify(userMemberInfo),
  });

  return result.toDataStreamResponse();
}
