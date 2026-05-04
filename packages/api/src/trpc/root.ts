import { t } from "./index";
import { authRouter } from "../routers/auth";
import { tenantRouter } from "../routers/tenant";
import { batchRouter } from "../routers/batch";

// Explicitly import branded types to ensure they are available for inference in this module
import type { TRPCContext, PrismaClient, TenantPrismaClient } from "./context";

/**
 * Root Router Composition.
 */
export const appRouter = t.router({
  auth: authRouter,
  tenant: tenantRouter,
  batch: batchRouter,
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
