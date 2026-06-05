const { z } = require("zod");
const { mcqFormSchema } = require("./packages/schema/dist/index.js");

const dummy = {
  "question": "What is 2+2?",
  "answer": "4",
  "options": ["1", "2", "3", "4"],
  "type": "SINGLE",
  "subjectId": "123",
  "chapterId": "456",
  "session": 2026,
  "context": {
    "text": "A context"
  }
};

try {
  const res = mcqFormSchema.parse(dummy);
  console.log("Success", res);
} catch (e) {
  console.error("ZodError", e.errors);
}
