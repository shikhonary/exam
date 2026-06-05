import { type TRPCRouterRecord } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc/index";
import { AcademicHierarchyService } from "../services/academic-hierarchy.service";

export const academicHierarchyRouter = createTRPCRouter({
  getTree: publicProcedure.query(async ({ ctx }) => {
    const service = new AcademicHierarchyService(ctx.db);
    const data = await service.getTree();
    return { success: true, data };
  }),
} satisfies TRPCRouterRecord);
