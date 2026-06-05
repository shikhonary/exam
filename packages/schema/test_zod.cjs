const { z } = require("zod");

const questionContextSchema = z.object({
  text: z.string().optional().or(z.literal("")),
  url: z.string().url("Valid URL is required").optional().or(z.literal("")),
  title: z.string().optional().or(z.literal("")),
});

const mcqFormSchema = z.object({
  explanation: z.string().optional().or(z.literal("")),
  questionContext: questionContextSchema.optional().nullable(),
});

try {
  mcqFormSchema.parse({
    explanation: "",
    questionContext: { text: "Some context" }
  });
  console.log("Empty string explanation PASSES");
} catch (e) {
  console.log("Empty string explanation FAILS", e.errors);
}

try {
  mcqFormSchema.parse({
    explanation: null,
    questionContext: "Some context"
  });
  console.log("Null explanation PASSES");
} catch (e) {
  console.log("Null explanation FAILS", e.errors);
}
