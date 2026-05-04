import { enumToOptions } from "../enum-utils";

/**
 * Tenant classification categories
 */
export enum TENANT_TYPE {
  UNION = "UNION",
  MUNICIPALITY = "MUNICIPALITY",
  WARD = "WARD",
  OTHER = "OTHER",
}

/**
 * Lifecycle status of the tenant's dedicated database
 */
export enum TENANT_DATABASE_STATUS {
  PROVISIONING = "PROVISIONING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum TENANT_INVITATION_STATUS {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}

export const tenantTypeOptions = [
  {
    value: TENANT_TYPE.UNION,
    label: "Union Parishad",
    description: "Lowest tier of regional administration",
  },
  {
    value: TENANT_TYPE.MUNICIPALITY,
    label: "Municipality (Paurashava)",
    description: "Urban local government",
  },
  {
    value: TENANT_TYPE.WARD,
    label: "Ward",
    description: "Smaller administrative division",
  },
  {
    value: TENANT_TYPE.OTHER,
    label: "Other",
    description: "Other administrative units",
  },
] as const;

export const tenantDatabaseStatusOptions = enumToOptions(
  TENANT_DATABASE_STATUS,
);

export const tenantInvitationStatusOptions = enumToOptions(
  TENANT_INVITATION_STATUS,
);
