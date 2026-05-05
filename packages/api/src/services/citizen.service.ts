import { TenantClient, TenantTypes } from "@workspace/db";
import { Citizen, citizenSchema } from "@workspace/schema";

export class CitizenService {
  constructor(private readonly prisma: TenantClient) {}

  async create(data: Citizen) {
    const validatedData = citizenSchema.parse(data);

    const citizen = await this.prisma.citizen.create({
      data: validatedData,
    });

    return {
      success: true,
      message: "Citizen record created successfully",
      data: citizen,
    };
  }

  async update(id: string, data: Partial<Citizen>) {
    const validatedData = citizenSchema.partial().parse(data);

    const citizen = await this.prisma.citizen.update({
      where: { id },
      data: validatedData,
    });

    return {
      success: true,
      message: "Citizen record updated successfully",
      data: citizen,
    };
  }

  async getById(id: string) {
    const citizen = await this.prisma.citizen.findUnique({
      where: { id },
    });

    if (!citizen) {
      throw new Error("Citizen record not found");
    }

    return {
      success: true,
      data: citizen,
    };
  }

  async getByNid(nid: string) {
    const citizen = await this.prisma.citizen.findUnique({
      where: { nid },
    });

    return {
      success: true,
      data: citizen,
    };
  }

  async list(filters: {
    page?: number;
    limit?: number;
    search?: string | null;
    wardNo?: number;
    gender?: string;
  }) {
    const { page = 1, limit = 10, search, wardNo, gender } = filters;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { fullNameEn: { contains: search, mode: "insensitive" } },
        { fullNameBn: { contains: search, mode: "insensitive" } },
        { nid: { contains: search, mode: "insensitive" } },
        { mobile: { contains: search, mode: "insensitive" } },
      ];
    }

    if (wardNo) {
      where.presentWardNo = wardNo;
    }

    if (gender) {
      where.gender = gender;
    }

    const [items, total] = await Promise.all([
      this.prisma.citizen.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.citizen.count({ where }),
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
}
