/**
 * Personal information options for students/members
 */

export enum GENDER {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum NATIONALITY {
  BANGLADESHI = "BANGLADESHI",
  OTHER = "OTHER",
}

export enum BLOOD_GROUP {
  A_POSITIVE = "A_POSITIVE",
  A_NEGATIVE = "A_NEGATIVE",
  B_POSITIVE = "B_POSITIVE",
  B_NEGATIVE = "B_NEGATIVE",
  AB_POSITIVE = "AB_POSITIVE",
  AB_NEGATIVE = "AB_NEGATIVE",
  O_POSITIVE = "O_POSITIVE",
  O_NEGATIVE = "O_NEGATIVE",
}

export enum RELIGION {
  ISLAM = "ISLAM",
  HINDUISM = "HINDUISM",
  CHRISTIANITY = "CHRISTIANITY",
  BUDDHISM = "BUDDHISM",
  OTHER = "OTHER",
}

export const genderOptions = [
  { value: GENDER.MALE, labelEn: "Male", labelBn: "পুরুষ" },
  { value: GENDER.FEMALE, labelEn: "Female", labelBn: "মহিলা" },
  { value: GENDER.OTHER, labelEn: "Other", labelBn: "অন্যান্য" },
] as const;

export const bloodGroupOptions = [
  { value: BLOOD_GROUP.A_POSITIVE, labelEn: "A+", labelBn: "এ পজিটিভ (A+)" },
  { value: BLOOD_GROUP.A_NEGATIVE, labelEn: "A-", labelBn: "এ নেগেটিভ (A-)" },
  { value: BLOOD_GROUP.B_POSITIVE, labelEn: "B+", labelBn: "বি পজিটিভ (B+)" },
  { value: BLOOD_GROUP.B_NEGATIVE, labelEn: "B-", labelBn: "বি নেগেটিভ (B-)" },
  { value: BLOOD_GROUP.AB_POSITIVE, labelEn: "AB+", labelBn: "এবি পজিটিভ (AB+)" },
  { value: BLOOD_GROUP.AB_NEGATIVE, labelEn: "AB-", labelBn: "এবি নেগেটিভ (AB-)" },
  { value: BLOOD_GROUP.O_POSITIVE, labelEn: "O+", labelBn: "ও পজিটিভ (O+)" },
  { value: BLOOD_GROUP.O_NEGATIVE, labelEn: "O-", labelBn: "ও নেগেটিভ (O-)" },
] as const;

export const religionOptions = [
  { value: RELIGION.ISLAM, labelEn: "Islam", labelBn: "ইসলাম" },
  { value: RELIGION.HINDUISM, labelEn: "Hinduism", labelBn: "সনাতন" },
  { value: RELIGION.CHRISTIANITY, labelEn: "Christianity", labelBn: "খ্রিস্টান" },
  { value: RELIGION.BUDDHISM, labelEn: "Buddhism", labelBn: "বৌদ্ধ" },
  { value: RELIGION.OTHER, labelEn: "Other", labelBn: "অন্যান্য" },
] as const;

export const nationalityOptions = [
  { value: "BANGLADESHI", labelEn: "Bangladeshi", labelBn: "বাংলাদেশী" },
  { value: "OTHER", labelEn: "Other", labelBn: "অন্যান্য" },
] as const;
