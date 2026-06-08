import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { StudentService } from "../services/student.service";
import { idSchema, listInput, updateStudentSchema } from "../shared/input/student";
import { studentFormSchema } from "@workspace/schema";

export const studentRouter = createTRPCRouter({
  list: tenantProcedure.input(listInput).query(async ({ ctx, input }) => {
    const service = new StudentService(ctx.tenantClient, ctx.db);
    const data = await service.list(input);
    return {
      success: true,
      data,
    };
  }),

  getById: tenantProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const service = new StudentService(ctx.tenantClient, ctx.db);
    const data = await service.getById(input);
    return {
      success: true,
      data,
    };
  }),

  create: baseTenantMutationProcedure
    .input(studentFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new StudentService(ctx.tenantClient, ctx.db);
      const data = await service.create(input);
      return {
        success: true,
        message: "Student created successfully",
        data,
      };
    }),

  update: baseTenantMutationProcedure
    .input(updateStudentSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new StudentService(ctx.tenantClient, ctx.db);
      const data = await service.update(input);
      return {
        success: true,
        message: "Student updated successfully",
        data,
      };
    }),

  delete: baseTenantMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new StudentService(ctx.tenantClient, ctx.db);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Student deleted successfully",
        data,
      };
    }),

  bulkDelete: baseTenantMutationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new StudentService(ctx.tenantClient, ctx.db);
      const data = await service.bulkDelete(input.ids);
      return {
        success: true,
        message: "Students deleted successfully",
        data,
      };
    }),

  toggleActive: baseTenantMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new StudentService(ctx.tenantClient, ctx.db);
      const data = await service.toggleActive(input.id);
      return {
        success: true,
        message: "Student status toggled successfully",
        data,
      };
    }),

  bulkToggleActive: baseTenantMutationProcedure
    .input(z.object({ ids: z.array(z.string()), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const service = new StudentService(ctx.tenantClient, ctx.db);
      const data = await service.bulkToggleActive(input.ids, input.isActive);
      return {
        success: true,
        message: "Students status updated successfully",
        data,
      };
    }),

} satisfies TRPCRouterRecord);
