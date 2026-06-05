import { z } from "zod";
import { PrismaClient } from "./packages/db/master-client-types/index.js";
import { mcqFormSchema } from "./packages/schema/src/mcq.js";

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

      // Dry run Prisma types by creating it (we'll just catch the connection error if any, 
      // but if there's a schema validation error, it will throw synchronously or locally)
      // Actually we don't want to insert if not needed, but Neon might connect. 
      // We just want to see if Prisma type validator throws.
      // We don't even need to execute it to see type errors, but Prisma does runtime validation.
      
      // Let's use Prisma.validator to see if the type is correct
      // But since we want to catch "Unknown argument", we can try passing it to a mock or just let it fail on connect/insert
      try {
         await db.mcq.create({ data });
         console.log("Success!");
         await db.mcq.deleteMany({ where: { question: "What is 2+2?" } });
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
