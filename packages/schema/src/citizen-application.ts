import { z } from "zod";
import {
  GENDER,
  MARITAL_STATUS,
  RELIGION,
  RESIDENT_STATUS,
} from "@workspace/utils";

export const citizenApplicationSchema = z.object({
  // Basic Info
  fullNameEn: z.string().optional().nullable(),
  fullNameBn: z.string().min(1, "Full name (Bangla) is required"),
  nid: z.string().min(1, "NID is required"),
  birthRegistrationNo: z.string().optional().nullable(),
  passportNo: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
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
  presentWardNo: z.coerce.number().int().positive("Ward number must be positive"),
  presentDistrict: z.string().min(1, "District is required"),
  presentUpazila: z.string().min(1, "Upazila is required"),
  presentPostOffice: z.string().min(1, "Post office is required"),

  // Permanent Address
  permanentVillageEn: z.string().optional().nullable(),
  permanentVillageBn: z.string().min(1, "Permanent village (Bangla) is required"),
  permanentRoadBlockSectorEn: z.string().optional().nullable(),
  permanentRoadBlockSectorBn: z.string().optional().nullable(),
  permanentHoldingNo: z.string().optional().nullable(),
  permanentWardNo: z.coerce.number().int().positive("Ward number must be positive"),
  permanentDistrict: z.string().min(1, "District is required"),
  permanentUpazila: z.string().min(1, "Upazila is required"),
  permanentPostOffice: z.string().min(1, "Post office is required"),

  // Contact
  mobile: z.string().min(11, "Mobile number must be at least 11 digits"),
  email: z.string().email("Invalid email address").optional().nullable().or(z.literal("")),
  commentsEn: z.string().optional().nullable(),
  commentsBn: z.string().optional().nullable(),
});

export type CitizenApplicationFormValues = z.infer<typeof citizenApplicationSchema>;
