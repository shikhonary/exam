import { type TenantClient } from "@workspace/db";
import { handlePrismaError } from "../middleware/error-handler";
import {
  villageFormSchema,
  uuidSchema,
  type VillageFormValues,
} from "@workspace/schema";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  type idInputType,
  type listInputType,
  type updateVillageInputType,
} from "../shared/input/village";

/**
 * Service for managing Villages (Tenant Level)
 */
export class VillageService {
  constructor(private db: TenantClient) {}

  async list(input: listInputType) {
    try {
      const { wardId, ...rest } = input;
      const where = buildWhere(rest, ["name", "displayName"]);
      
      if (wardId) {
        where.wardId = wardId;
      }

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.village.findMany({
          where,
          orderBy,
          include: {
            ward: {
              select: {
                name: true,
                displayName: true,
              },
            },
          },
          ...pagination,
        }),
        this.db.village.count({ where }),
      ]);

      return {
        items,
        total,
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(input: idInputType) {
    try {
      const validatedId = uuidSchema.parse(input);
      return await this.db.village.findUnique({
        where: { id: validatedId },
        include: {
          ward: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: VillageFormValues) {
    try {
      const data = villageFormSchema.parse(input);
      return await this.db.village.create({
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(input: updateVillageInputType) {
    try {
      const { id, ...data } = input;
      return await this.db.village.update({
        where: { id },
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(input: idInputType) {
    try {
      const validatedId = uuidSchema.parse(input);
      return await this.db.village.delete({ where: { id: validatedId } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async toggleActive(input: string) {
    try {
      const validatedId = uuidSchema.parse(input);
      const village = await this.db.village.findUnique({
        where: { id: validatedId },
      });

      if (!village) throw new Error("Village not found");

      return await this.db.village.update({
        where: { id: validatedId },
        data: { isActive: !village.isActive },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStats() {
    try {
      const [total, active] = await Promise.all([
        this.db.village.count(),
        this.db.village.count({ where: { isActive: true } }),
      ]);

      return {
        total,
        active,
        inactive: total - active,
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async forSelection(wardId?: string) {
    try {
      return await this.db.village.findMany({
        where: { 
          isActive: true,
          ...(wardId ? { wardId } : {}),
        },
        select: {
          id: true,
          name: true,
          displayName: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
