/**
 * @workspace/api
 *
 * tRPC API Layer — Routers, Context, Procedures & Business Logic
 */

export { appRouter, type AppRouter } from "./trpc/root";
export { createTRPCContext } from "./trpc/context";
export {
  publicProcedure,
  protectedProcedure,
  adminProcedure,
  tenantProcedure,
  tenantAdminProcedure,
} from "./trpc/index";

// Export services for direct use if needed (e.g., in server actions or background jobs)
export * from "./services/tenant.service";

// Export shared types and schemas
export * from "./shared/pagination";
export * from "./shared/filters";
export * from "./shared/query-builder";

// Re-export required types for portability
export type {
  PrismaClient,
  TenantPrismaClient,
  Context,
  TRPCContext,
} from "./trpc/context";
export type { User } from "@workspace/auth";
export type { Tenant } from "@workspace/db";
