/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { promises as fs } from "fs";

const jsonData = `
{
  "familyName": "My Family",
  "familyHead": "الطيب",
  "members": [
    {
      "id": 2,
      "name": "مجدي",
      "age": null,
      "gender": "male",
      "spouse": "سوزان",
      "fatherId": 1,
      "children": [
        {
          "id": 4,
          "name": "محمد",
          "age": null,
          "gender": "male",
          "spouse": "قنوت",
          "fatherId": 2,
          "children": [
            {
              "id": 6,
              "name": "جوانا",
              "age": null,
              "gender": "female",
              "spouse": null,
              "fatherId": 4,
              "children": [
                {
                  "id": 7,
                  "name": "خالد",
                  "age": null,
                  "gender": "male",
                  "spouse": null,
                  "fatherId": null,
                  "children": [
                    {
                      "id": 8,
                      "name": "عمر",
                      "age": null,
                      "gender": "male",
                      "spouse": null,
                      "fatherId": 7,
                      "children": []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

`;

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();
  // Get a language model
  const model = groq("llama-3.3-70b-versatile");
  //   const model = groq("deepseek-r1-distill-qwen-32b");

  //   const familyTree = await generateFamilyTree(1);
  const systemPrompt = await fs.readFile(
    process.cwd() + "/src/app/systemprompt.md",
    "utf8",
  );

  // Call the language model with the prompt

  const result = streamText({
    model,
    messages,
    maxTokens: 8192,
    temperature: 0.7,
    topP: 0.4,
    system: systemPrompt + jsonData + "\n\n **Current User:** Mohammed, ID:4",
  });

  // Respond with a streaming response
  return result.toDataStreamResponse();
}
