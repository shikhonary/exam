import { cache } from "react";
import { headers } from "next/headers";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@workspace/api";
import { appRouter, createTRPCContext } from "@workspace/api";
import { QueryClient } from "@tanstack/react-query";

export const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "exam-rsc");
  return createTRPCContext({ headers: heads });
});

export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: { staleTime: 30 * 1000 },
      },
    }),
);

export const trpc = createTRPCOptionsProxy<AppRouter>({
  router: appRouter,
  ctx: createContext,
  queryClient: getQueryClient,
});

export const createCaller = cache(
  async (): Promise<ReturnType<typeof appRouter.createCaller>> => {
    const context = await createContext();
    return appRouter.createCaller(context);
  },
);
