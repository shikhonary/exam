"use client";

import { useQueryStates } from "nuqs";
import {
  academicClassFilterSchema,
  academicSubjectFilterSchema,
  academicChapterFilterSchema,
  academicChapterTopicFilterSchema,
  academicSubTopicFilterSchema,
  cqFilterSchema,
  shortAnswerFilterSchema,
  mcqFilterSchema,
  studentFilterSchema,
  batchFilterSchema,
  tenantFilterSchema,
  subscriptionPlanFilterSchema,
  subscriptionFilterSchema,
  questionTypeFilterSchema,
  academicYearFilterSchema,
  counterFilterSchema,
  admissionFeeFilterSchema,
  monthlyFeeFilterSchema,
  wardFilterSchema,
  villageFilterSchema,
  citizenApplicationFilterSchema,
  citizenFilterSchema,
  assessmentFilterSchema,
  holdingTaxFilterSchema,
  certificateCounterFilterSchema,
  tradeLicenseCategoryFilterSchema,
  tradeLicenseApplicationFilterSchema,
  tradeLicenseFilterSchema,
  successionApplicationFilterSchema,
  questionPaperFilterSchema,
  userFilterSchema,
  settingFilterSchema,
  auditLogFilterSchema,
  notificationFilterSchema,
  examFilterSchema,
} from "./schema";

export const useAcademicClassFilters = () =>
  useQueryStates(academicClassFilterSchema);
export const useAcademicSubjectFilters = () =>
  useQueryStates(academicSubjectFilterSchema);
export const useAcademicChapterFilters = () =>
  useQueryStates(academicChapterFilterSchema);
export const useAcademicChapterTopicFilters = () =>
  useQueryStates(academicChapterTopicFilterSchema);
export const useAcademicSubTopicFilters = () =>
  useQueryStates(academicSubTopicFilterSchema);
export const useCqFilters = () => useQueryStates(cqFilterSchema);
export const useShortAnswerFilters = () =>
  useQueryStates(shortAnswerFilterSchema);
export const useMCQFilters = () => useQueryStates(mcqFilterSchema);
export const useQuestionPaperFilters = () =>
  useQueryStates(questionPaperFilterSchema);
export const useStudentFilters = () => useQueryStates(studentFilterSchema);
export const useBatchFilters = () => useQueryStates(batchFilterSchema);
export const useTenantFilters = () => useQueryStates(tenantFilterSchema);
export const useSubscriptionPlanFilters = () =>
  useQueryStates(subscriptionPlanFilterSchema);
export const useSubscriptionFilters = () =>
  useQueryStates(subscriptionFilterSchema);
export const useQuestionTypeFilters = () =>
  useQueryStates(questionTypeFilterSchema);
export const useAcademicYearFilters = () =>
  useQueryStates(academicYearFilterSchema);
export const useCounterFilters = () => useQueryStates(counterFilterSchema);
export const useAdmissionFeeFilters = () =>
  useQueryStates(admissionFeeFilterSchema);
export const useMonthlyFeeFilters = () =>
  useQueryStates(monthlyFeeFilterSchema);
export const useWardFilters = () => useQueryStates(wardFilterSchema);
export const useVillageFilters = () => useQueryStates(villageFilterSchema);
export const useCitizenApplicationFilters = () =>
  useQueryStates(citizenApplicationFilterSchema);
export const useCitizenFilters = () => useQueryStates(citizenFilterSchema);
export const useAssessmentFilters = () =>
  useQueryStates(assessmentFilterSchema);

export const useHoldingTaxFilters = () =>
  useQueryStates(holdingTaxFilterSchema);
export const useCertificateCounterFilters = () =>
  useQueryStates(certificateCounterFilterSchema);
export const useTradeLicenseCategoryFilters = () =>
  useQueryStates(tradeLicenseCategoryFilterSchema);
export const useTradeLicenseApplicationFilters = () =>
  useQueryStates(tradeLicenseApplicationFilterSchema);
export const useTradeLicenseFilters = () =>
  useQueryStates(tradeLicenseFilterSchema);
export const useSuccessionApplicationFilters = () =>
  useQueryStates(successionApplicationFilterSchema);
export const useUserFilters = () => useQueryStates(userFilterSchema);
export const useSettingFilters = () => useQueryStates(settingFilterSchema);
export const useAuditLogFilters = () => useQueryStates(auditLogFilterSchema);
export const useNotificationFilters = () =>
  useQueryStates(notificationFilterSchema);
export const useExamFilters = () => useQueryStates(examFilterSchema);
