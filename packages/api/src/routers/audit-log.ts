import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
} from "../trpc/index";
import { AuditLogService } from "../services/audit-log.service";
import {
  listAuditLogInput,
} from "../shared/input/audit-log";

export const auditLogRouter = createTRPCRouter({
  list: adminProcedure.input(listAuditLogInput).query(async ({ ctx, input }) => {
    const service = new AuditLogService(ctx.db);
    const data = await service.list(input);
    return {
      success: true,
      data,
    };
  }),

  getById: adminProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const service = new AuditLogService(ctx.db);
    const data = await service.getById(input.id);
    return {
      success: true,
      data,
    };
  }),
} satisfies TRPCRouterRecord);
