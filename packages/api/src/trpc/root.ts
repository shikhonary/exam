import { t } from "./index";
import { authRouter } from "../routers/auth";
import { academicClassRouter } from "../routers/academic-class";
import { studentRouter } from "../routers/student";
import { userRouter } from "../routers/user";
import { mcqRouter } from "../routers/mcq";
import { examRouter } from "../routers/exam";

// Explicitly import branded types to ensure they are available for inference in this module
import type { TRPCContext, PrismaClient, TenantPrismaClient } from "./context";

/**
 * Root Router Composition.
 */
export const appRouter = t.router({
  auth: authRouter,
  academicClass: academicClassRouter,
  student: studentRouter,
  user: userRouter,
  mcq: mcqRouter,
  exam: examRouter,
});

/**
 * Export AppRouter type for frontend consumption.
 */
export type AppRouter = typeof appRouter;

/**
 * Re-exporting these here as well just to be absolutely sure the compiler
 * can name them when resolving AppRouter.
 */
export type { TRPCContext, PrismaClient, TenantPrismaClient };
