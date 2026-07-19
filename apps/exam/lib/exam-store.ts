import { create } from "zustand";

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  type: string;
  isMath: boolean;
  statements: string[];
}

interface ExamState {
  attemptId: string | null;
  examId: string | null;
  questions: ExamQuestion[];
  currentIndex: number;
  answers: Record<string, string>; // mcqId → selectedOption
  remainingSeconds: number;
  isSubmitted: boolean;
  totalDuration: number; // in seconds
}

interface ExamActions {
  initExam: (data: {
    attemptId: string;
    examId: string;
    questions: ExamQuestion[];
    durationMinutes: number;
  }) => void;
  setAnswer: (mcqId: string, option: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  tick: () => void;
  markSubmitted: () => void;
  reset: () => void;
}

type ExamStore = ExamState & ExamActions;

export const useExamStore = create<ExamStore>()((set, get) => ({
  attemptId: null,
  examId: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  remainingSeconds: 0,
  isSubmitted: false,
  totalDuration: 0,

  initExam: (data) =>
    set({
      attemptId: data.attemptId,
      examId: data.examId,
      questions: data.questions,
      currentIndex: 0,
      answers: {},
      remainingSeconds: data.durationMinutes * 60,
      isSubmitted: false,
      totalDuration: data.durationMinutes * 60,
    }),

  setAnswer: (mcqId, option) =>
    set((state) => ({
      answers: { ...state.answers, [mcqId]: option },
    })),

  nextQuestion: () =>
    set((state) => ({
      currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1),
    })),

  prevQuestion: () =>
    set((state) => ({
      currentIndex: Math.max(state.currentIndex - 1, 0),
    })),

  goToQuestion: (index) =>
    set((state) => ({
      currentIndex: Math.max(0, Math.min(index, state.questions.length - 1)),
    })),

  tick: () =>
    set((state) => ({
      remainingSeconds: Math.max(state.remainingSeconds - 1, 0),
    })),

  markSubmitted: () => set({ isSubmitted: true }),

  reset: () =>
    set({
      attemptId: null,
      examId: null,
      questions: [],
      currentIndex: 0,
      answers: {},
      remainingSeconds: 0,
      isSubmitted: false,
      totalDuration: 0,
    }),
}));
