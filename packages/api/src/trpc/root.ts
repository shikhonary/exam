import { t } from "./index";
import { authRouter } from "../routers/auth";
import { tenantRouter } from "../routers/tenant";
import { batchRouter } from "../routers/batch";
import { studentRouter } from "../routers/student";
import { admissionFeeRouter } from "../routers/admission-fee";
import { monthlyFeeRouter } from "../routers/monthly-fee";
import { counterRouter } from "../routers/counter";

import { subscriptionPlanRouter } from "../routers/subscription-plan";
import { subscriptionRouter } from "../routers/subscription";
import { academicYearRouter } from "../routers/academic-year";
import { academicClassRouter } from "../routers/academic-class";
import { academicSubjectRouter } from "../routers/academic-subject";
import { academicChapterRouter } from "../routers/academic-chapter";
import { academicChapterTopicRouter } from "../routers/academic-chapter-topic";
import { academicHierarchyRouter } from "../routers/academic-hierarchy";
import { questionTypeRouter } from "../routers/question-type";
import { cqRouter } from "../routers/cq";
import { mcqRouter } from "../routers/mcq";
import { shortAnswerRouter } from "../routers/short-answer";
import { questionPaperRouter } from "../routers/question-paper";
import { userRouter } from "../routers/user";
import { settingRouter } from "../routers/setting";
import { auditLogRouter } from "../routers/audit-log";
import { notificationRouter } from "../routers/notification";

// Explicitly import branded types to ensure they are available for inference in this module
import type { TRPCContext, PrismaClient, TenantPrismaClient } from "./context";

/**
 * Root Router Composition.
 */
export const appRouter = t.router({
  auth: authRouter,
  tenant: tenantRouter,
  batch: batchRouter,
  student: studentRouter,
  admissionFee: admissionFeeRouter,
  monthlyFee: monthlyFeeRouter,
  counter: counterRouter,

  subscriptionPlan: subscriptionPlanRouter,
  subscription: subscriptionRouter,
  academicYear: academicYearRouter,
  academicClass: academicClassRouter,
  academicSubject: academicSubjectRouter,
  academicChapter: academicChapterRouter,
  academicChapterTopic: academicChapterTopicRouter,
  academicHierarchy: academicHierarchyRouter,
  questionType: questionTypeRouter,
  cq: cqRouter,
  mcq: mcqRouter,
  shortAnswer: shortAnswerRouter,
  questionPaper: questionPaperRouter,
  user: userRouter,
  setting: settingRouter,
  auditLog: auditLogRouter,
  notification: notificationRouter,
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
