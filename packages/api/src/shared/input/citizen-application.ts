import { z } from "zod";
import { baseListInputSchema } from "../filters";

export const listInput = baseListInputSchema.extend({
  search: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  wardNo: z.coerce.number().optional().nullable(),
});

export const idSchema = z.string().uuid();

export const updateCitizenApplicationSchema = z.object({
  id: idSchema,
  data: z.any(), // Will be validated by citizenApplicationSchema in the service
});

export const applicationActionSchema = z.object({
  id: idSchema,
});
