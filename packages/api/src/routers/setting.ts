import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  baseMutationProcedure,
} from "../trpc/index";
import { SettingService } from "../services/setting.service";
import {
  listSettingInput,
  updateSettingInputSchema,
  bulkUpdateSettingsInputSchema,
} from "../shared/input/setting";
import { settingFormSchema } from "@workspace/schema";

export const settingRouter = createTRPCRouter({
  list: adminProcedure.input(listSettingInput).query(async ({ ctx, input }) => {
    const service = new SettingService(ctx.db);
    const data = await service.list(input);
    return {
      success: true,
      data,
    };
  }),

  getByKey: adminProcedure.input(z.object({ key: z.string() })).query(async ({ ctx, input }) => {
    const service = new SettingService(ctx.db);
    const data = await service.getByKey(input.key);
    return {
      success: true,
      data,
    };
  }),

  upsert: baseMutationProcedure
    .input(settingFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new SettingService(ctx.db);
      const data = await service.upsert(input);
      return {
        success: true,
        message: "Setting saved successfully",
        data,
      };
    }),

  bulkUpdate: baseMutationProcedure
    .input(bulkUpdateSettingsInputSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new SettingService(ctx.db);
      const data = await service.bulkUpdate(input.settings);
      return {
        success: true,
        message: "Settings updated successfully",
        data,
      };
    }),

  delete: baseMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new SettingService(ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Setting deleted successfully",
        data,
      };
    }),
} satisfies TRPCRouterRecord);
