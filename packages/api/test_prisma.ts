import { z } from "zod";
import { PrismaClient } from "@workspace/db";
import { mcqFormSchema } from "../schema/src/mcq.js";

const db = new PrismaClient();

const dummy = {
  "question": "What is 2+2?",
  "answer": "4",
  "options": ["1", "2", "3", "4"],
  "type": "SINGLE",
  "isMath": false,
  "session": 2026,
  "subjectId": "c918e364-784e-4271-8bb2-87f82e1a1051",
  "chapterId": "c918e364-784e-4271-8bb2-87f82e1a1051",
  "topicId": "",
  "subTopicId": "",
  "questionTypeId": "",
  "contextId": "",
  "questionContext": null,
  "explanation": null
};

async function test() {
  try {
    const cleanedItems = [dummy].map((item: any) => {
      const rawCtx = item.questionContext || item.context;
      const formattedCtx = typeof rawCtx === 'string' ? { text: rawCtx } : rawCtx;
      
      return {
        ...item,
        explanation: item.explanation == null ? "" : String(item.explanation),
        questionContext: formattedCtx,
      };
    });

    const validated = z.array(mcqFormSchema).parse(cleanedItems);
    
    for (const item of validated) {
      const { questionContext, ...rest } = item;
      
      const data = {
        ...rest,
        topicId: rest.topicId || null,
        subTopicId: rest.subTopicId || null,
        questionTypeId: rest.questionTypeId || null,
        contextId: rest.contextId || null,
        questionContext: (questionContext && !rest.contextId) ? {
          create: questionContext
        } : undefined,
      };

      console.log("Prisma data payload:", JSON.stringify(data, null, 2));

      try {
         await db.mcq.create({ data });
         console.log("Success!");
      } catch (e) {
         console.error("Prisma error:", e);
      }
    }
  } catch (err) {
    console.error("Zod or script Error:", err);
  } finally {
    await db.$disconnect();
  }
}

test();
