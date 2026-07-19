import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StudentState {
  studentId: string | null;
  name: string | null;
  mobile: string | null;
  isVerified: boolean;
}

interface StudentActions {
  setStudent: (data: { studentId: string; name: string; mobile: string }) => void;
  setVerified: (verified: boolean) => void;
  clear: () => void;
}

type StudentStore = StudentState & StudentActions;

export const useStudentStore = create<StudentStore>()(
  persist(
    (set) => ({
      studentId: null,
      name: null,
      mobile: null,
      isVerified: false,

      setStudent: (data) =>
        set({
          studentId: data.studentId,
          name: data.name,
          mobile: data.mobile,
        }),

      setVerified: (verified) => set({ isVerified: verified }),

      clear: () =>
        set({
          studentId: null,
          name: null,
          mobile: null,
          isVerified: false,
        }),
    }),
    {
      name: "shikhonary-student",
    },
  ),
);
