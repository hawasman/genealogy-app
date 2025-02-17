"use server";
import { env } from "@/env";
import { createGroq } from "@ai-sdk/groq";

const groq = createGroq({
  apiKey: env.GROQ_API_KEY,
});

const systemPrompt = ``;

// export const generateCompletion = async (prompt: string) => {
//   const { text } = await generateText({
//     model: groq("gemma2-9b-it"),
//     prompt: "Write a vegetarian lasagna recipe for 4 people.",
//   });
// };
