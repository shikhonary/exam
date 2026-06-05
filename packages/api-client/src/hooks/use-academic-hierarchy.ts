"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "../client";

export function useAcademicHierarchyTree() {
  const trpc = useTRPC();

  return useQuery({
    ...trpc.academicHierarchy.getTree.queryOptions(),
  });
}
