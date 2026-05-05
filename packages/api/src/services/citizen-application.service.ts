import { TenantClient, TenantTypes } from "@workspace/db";
import { CitizenApplicationFormValues, citizenApplicationSchema } from "@workspace/schema";

export class CitizenApplicationService {
  constructor(private readonly prisma: TenantClient) {}

  async create(data: CitizenApplicationFormValues) {
    const validatedData = citizenApplicationSchema.parse(data);

    const application = await this.prisma.citizenApplication.create({
      data: validatedData,
    });

    return {
      success: true,
      message: "Citizen application created successfully",
      data: application,
    };
  }

  async update(id: string, data: Partial<CitizenApplicationFormValues>) {
    // For update, we might want a different partial schema, 
    // but citizenApplicationSchema.partial() works too
    const validatedData = citizenApplicationSchema.partial().parse(data);

    const application = await this.prisma.citizenApplication.update({
      where: { id },
      data: validatedData,
    });

    return {
      success: true,
      message: "Citizen application updated successfully",
      data: application,
    };
  }

  async getById(id: string) {
    const application = await this.prisma.citizenApplication.findUnique({
      where: { id },
    });

    if (!application) {
      throw new Error("Citizen application not found");
    }

    return {
      success: true,
      data: application,
    };
  }

  async delete(id: string) {
    await this.prisma.citizenApplication.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Citizen application deleted successfully",
    };
  }

  async list(filters: {
    page?: number;
    limit?: number;
    search?: string | null;
    status?: string | null;
    wardNo?: number | null;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const { page = 1, limit = 10, search, status, wardNo, sortBy = "createdAt", sortOrder = "desc" } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { fullNameEn: { contains: search, mode: "insensitive" } },
        { fullNameBn: { contains: search, mode: "insensitive" } },
        { nid: { contains: search, mode: "insensitive" } },
        { mobile: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (wardNo) {
      where.presentWardNo = wardNo;
    }

    const [items, total] = await Promise.all([
      this.prisma.citizenApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.citizenApplication.count({ where }),
    ]);

    return {
      success: true,
      data: {
        items,
        total,
        page,
        limit,
      },
    };
  }

  async approve(id: string) {
    const application = await this.prisma.citizenApplication.findUnique({
      where: { id },
    });

    if (!application) {
      throw new Error("Application not found");
    }

    if (application.status !== "PENDING") {
      throw new Error(`Application is already ${application.status}`);
    }

    // Use a transaction to ensure data consistency
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Create Citizen record
      const citizen = await tx.citizen.create({
        data: {
          fullNameEn: application.fullNameEn,
          fullNameBn: application.fullNameBn,
          nid: application.nid!, // NID is verified/required now
          birthRegistrationNo: application.birthRegistrationNo,
          passportNo: application.passportNo,
          dateOfBirth: application.dateOfBirth!,
          fatherNameEn: application.fatherNameEn,
          fatherNameBn: application.fatherNameBn,
          motherNameEn: application.motherNameEn,
          motherNameBn: application.motherNameBn,
          occupation: application.occupation,
          residentStatus: application.residentStatus,
          educationalQualification: application.educationalQualification,
          religion: application.religion,
          gender: application.gender,
          maritalStatus: application.maritalStatus,
          presentVillageEn: application.presentVillageEn,
          presentVillageBn: application.presentVillageBn,
          presentRoadBlockSectorEn: application.presentRoadBlockSectorEn,
          presentRoadBlockSectorBn: application.presentRoadBlockSectorBn,
          presentHoldingNo: application.presentHoldingNo,
          presentWardNo: application.presentWardNo,
          presentDistrict: application.presentDistrict,
          presentUpazila: application.presentUpazila,
          presentPostOffice: application.presentPostOffice,
          permanentVillageEn: application.permanentVillageEn,
          permanentVillageBn: application.permanentVillageBn,
          permanentRoadBlockSectorEn: application.permanentRoadBlockSectorEn,
          permanentRoadBlockSectorBn: application.permanentRoadBlockSectorBn,
          permanentHoldingNo: application.permanentHoldingNo,
          permanentWardNo: application.permanentWardNo,
          permanentDistrict: application.permanentDistrict,
          permanentUpazila: application.permanentUpazila,
          permanentPostOffice: application.permanentPostOffice,
          mobile: application.mobile,
          email: application.email,
          isActive: true,
        },
      });

      // 2. Update Application status
      const updatedApplication = await tx.citizenApplication.update({
        where: { id },
        data: {
          status: "APPROVED",
          citizenId: citizen.id,
        },
      });

      return { citizen, application: updatedApplication };
    });

    return {
      success: true,
      message: "Application approved and citizen record created",
      data: result,
    };
  }

  async reject(id: string) {
    const application = await this.prisma.citizenApplication.update({
      where: { id },
      data: { status: "REJECTED" },
    });

    return {
      success: true,
      message: "Application rejected successfully",
      data: application,
    };
  }

  async getStats() {
    const [total, pending, approved, rejected] = await Promise.all([
      this.prisma.citizenApplication.count(),
      this.prisma.citizenApplication.count({ where: { status: "PENDING" } }),
      this.prisma.citizenApplication.count({ where: { status: "APPROVED" } }),
      this.prisma.citizenApplication.count({ where: { status: "REJECTED" } }),
    ]);

    return {
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
      },
    };
  }
}
