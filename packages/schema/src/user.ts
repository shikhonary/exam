import { z } from "zod";
import {
  nameSchema,
  emailSchema,
  uuidSchema,
} from "./shared/fields";

export const USER_ROLES = ["ADMIN", "USER", "TEACHER", "STUDENT"] as const;

export const userFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  role: z.enum(USER_ROLES).default("USER"),
  image: z.string().url().optional().nullable().or(z.literal("")),
  isActive: z.boolean().default(true),
  emailVerified: z.boolean().default(false),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const defaultUserValues: Partial<UserFormValues> = {
  name: "",
  email: "",
  role: "USER",
  isActive: true,
  emailVerified: false,
};

export const updateUserSchema = userFormSchema.partial();

export const userSchema = userFormSchema.extend({
  id: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional().nullable(),
});

export type User = z.infer<typeof userSchema>;
