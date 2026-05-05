import { type TenantClient } from "@workspace/db";
import { handlePrismaError } from "../middleware/error-handler";
import {
  wardFormSchema,
  uuidSchema,
  type WardFormValues,
} from "@workspace/schema";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  type idInputType,
  type listInputType,
  type updateWardInputType,
} from "../shared/input/ward";

/**
 * Service for managing Wards (Tenant Level)
 */
export class WardService {
  /**
   * Note: This service expects a Tenant-specific Prisma Client
   */
  constructor(private db: TenantClient) {}

  async list(input: listInputType) {
    try {
      const where = buildWhere(input, ["name", "displayName"]);
      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.ward.findMany({
          where,
          orderBy,
          ...pagination,
        }),
        this.db.ward.count({ where }),
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
      return await this.db.ward.findUnique({
        where: { id: validatedId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: WardFormValues) {
    try {
      const data = wardFormSchema.parse(input);
      return await this.db.ward.create({
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(input: updateWardInputType) {
    try {
      const { id, ...data } = input;
      return await this.db.ward.update({
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
      return await this.db.ward.delete({ where: { id: validatedId } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async toggleActive(input: string) {
    try {
      const validatedId = uuidSchema.parse(input);
      const ward = await this.db.ward.findUnique({
        where: { id: validatedId },
      });

      if (!ward) throw new Error("Ward not found");

      return await this.db.ward.update({
        where: { id: validatedId },
        data: { isActive: !ward.isActive },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDelete(ids: string[]) {
    try {
      const validatedIds = uuidSchema.array().parse(ids);
      return await this.db.ward.deleteMany({
        where: { id: { in: validatedIds } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStats() {
    try {
      const [total, active] = await Promise.all([
        this.db.ward.count(),
        this.db.ward.count({ where: { isActive: true } }),
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

  async forSelection() {
    try {
      return await this.db.ward.findMany({
        where: { isActive: true },
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
