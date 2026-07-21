import { GoogleGenerativeAI } from "@google/generative-ai";

export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateExamFeedback(data: {
    studentName: string;
    examTitle: string;
    score: number;
    totalMarks: number;
    correctCount: number;
    wrongCount: number;
    totalQuestions: number;
  }): Promise<string> {
    try {
      // Updated model name to official Gemini 2.0 Flash identifier
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });

      const prompt = `
        You are an encouraging and insightful AI tutor providing minimal feedback to a student.
        Student Name: ${data.studentName}
        Exam Title: ${data.examTitle}
        Score: ${data.score} out of ${data.totalMarks}
        Questions Answered Correctly: ${data.correctCount} out of ${data.totalQuestions}
        Questions Answered Incorrectly: ${data.wrongCount}

        Write a short, engaging, and personalized feedback paragraph (3-4 sentences max) for the student.
        Make sure the feedback is written in Bengali, as the platform is geared towards Bengali students.
        Highlight their performance, offer brief encouragement, and keep the tone very supportive.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating AI feedback:", error);
      throw new Error("Failed to generate AI feedback");
    }
  }
}
