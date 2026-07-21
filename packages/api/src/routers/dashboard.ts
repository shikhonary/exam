import { type TRPCRouterRecord } from "@trpc/server";
import { createTRPCRouter, adminProcedure } from "../trpc/index";
import { DashboardService } from "../services/dashboard.service";

export const dashboardRouter = createTRPCRouter({
  getOverview: adminProcedure.query(async ({ ctx }) => {
    const service = new DashboardService(ctx.db);
    const data = await service.getOverview();
    return { success: true, data };
  }),
} satisfies TRPCRouterRecord);
