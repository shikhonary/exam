import { z } from "zod";
import {
  GENDER,
  MARITAL_STATUS,
  RELIGION,
  RESIDENT_STATUS,
} from "@workspace/utils";

export const citizenSchema = z.object({
  id: z.string().uuid().optional(),
  // Basic Info
  fullNameEn: z.string().optional().nullable(),
  fullNameBn: z.string().min(1, "Full name (Bangla) is required"),
  nid: z.string().min(1, "NID is required"), // Required for official citizen record
  birthRegistrationNo: z.string().optional().nullable(),
  passportNo: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date(), // Required for official record
  fatherNameEn: z.string().optional().nullable(),
  fatherNameBn: z.string().min(1, "Father's name (Bangla) is required"),
  motherNameEn: z.string().optional().nullable(),
  motherNameBn: z.string().min(1, "Mother's name (Bangla) is required"),
  occupation: z.string().optional().nullable(),

  residentStatus: z.nativeEnum(RESIDENT_STATUS),
  educationalQualification: z.string().optional().nullable(),
  religion: z.nativeEnum(RELIGION),
  gender: z.nativeEnum(GENDER),
  maritalStatus: z.nativeEnum(MARITAL_STATUS),

  // Present Address
  presentVillageEn: z.string().optional().nullable(),
  presentVillageBn: z.string().min(1, "Present village (Bangla) is required"),
  presentRoadBlockSectorEn: z.string().optional().nullable(),
  presentRoadBlockSectorBn: z.string().optional().nullable(),
  presentHoldingNo: z.string().optional().nullable(),
  presentWardNo: z.coerce.number().int().positive(),
  presentDistrict: z.string().min(1, "District is required"),
  presentUpazila: z.string().min(1, "Upazila is required"),
  presentPostOffice: z.string().min(1, "Post office is required"),

  // Permanent Address
  permanentVillageEn: z.string().optional().nullable(),
  permanentVillageBn: z.string().min(1, "Permanent village (Bangla) is required"),
  permanentRoadBlockSectorEn: z.string().optional().nullable(),
  permanentRoadBlockSectorBn: z.string().optional().nullable(),
  permanentHoldingNo: z.string().optional().nullable(),
  permanentWardNo: z.coerce.number().int().positive(),
  permanentDistrict: z.string().min(1, "District is required"),
  permanentUpazila: z.string().min(1, "Upazila is required"),
  permanentPostOffice: z.string().min(1, "Post office is required"),

  // Contact
  mobile: z.string().min(1, "Mobile number is required"),
  email: z.string().email().optional().nullable().or(z.literal("")),
  
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Citizen = z.infer<typeof citizenSchema>;

export const citizenListInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  wardNo: z.number().int().optional(),
  gender: z.nativeEnum(GENDER).optional(),
});
