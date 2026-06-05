import { z } from "zod";
import { type PrismaClient } from "@workspace/db";
import {
  userFormSchema,
  uuidSchema,
  type UserFormValues,
} from "@workspace/schema";
import { handlePrismaError } from "../middleware/error-handler";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  type idInputType,
  type listUserInputType,
  type updateUserInputType,
} from "../shared/input/user";

/**
 * Service for managing Users (Platform Level)
 */
export class UserService {
  constructor(private db: PrismaClient) {}

  /**
   * List users with pagination and filters
   */
  async list(input: listUserInputType) {
    try {
      const where = buildWhere(input, ["name", "email"]);

      if (input.role) {
        where.role = input.role;
      }

      if (input.isActive !== undefined && input.isActive !== null) {
        where.isActive = input.isActive;
      }

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.user.findMany({
          where,
          orderBy,
          ...pagination,
          include: {
            _count: {
              select: { tenants: true, memberships: true },
            },
          },
        }),
        this.db.user.count({ where }),
      ]);

      return {
        items,
        total,
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Get user by ID
   */
  async getById(input: idInputType) {
    try {
      const validatedId = uuidSchema.parse(input);
      return await this.db.user.findUnique({
        where: { id: validatedId },
        include: {
          memberships: {
            include: { tenant: true },
          },
          tenants: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Create a new user.
   */
  async create(input: UserFormValues) {
    try {
      const data = userFormSchema.parse(input);
      
      const user = await this.db.user.create({
        data,
      });

      return user;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Update user details.
   */
  async update(input: updateUserInputType) {
    try {
      const { id, ...data } = input;
      return await this.db.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Delete a user.
   */
  async delete(input: idInputType) {
    try {
      const validatedId = uuidSchema.parse(input);
      return await this.db.user.delete({
        where: { id: validatedId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Toggle user active status
   */
  async toggleStatus(input: idInputType) {
    try {
      const validatedId = uuidSchema.parse(input);
      const user = await this.db.user.findUnique({
        where: { id: validatedId },
        select: { isActive: true },
      });

      if (!user) return null;

      return await this.db.user.update({
        where: { id: validatedId },
        data: { isActive: !user.isActive },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Bulk activate users
   */
  async bulkActive(ids: string[]): Promise<{ count: number } | undefined> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.user.updateMany({
        where: { id: { in: validatedIds } },
        data: { isActive: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Bulk deactivate users
   */
  async bulkDeactive(ids: string[]): Promise<{ count: number } | undefined> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.user.updateMany({
        where: { id: { in: validatedIds } },
        data: { isActive: false },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Bulk delete users.
   */
  async bulkDelete(ids: string[]): Promise<{ count: number } | undefined> {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.user.deleteMany({
        where: { id: { in: validatedIds } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Get user statistics
   */
  async getStats() {
    try {
      const [total, active, inactive, byRole] = await Promise.all([
        this.db.user.count(),
        this.db.user.count({ where: { isActive: true } }),
        this.db.user.count({ where: { isActive: false } }),
        this.db.user.groupBy({ by: ["role"], _count: true }),
      ]);

      return {
        total,
        active,
        inactive,
        byRole: byRole.reduce(
          (acc, item) => ({ ...acc, [item.role]: item._count }),
          {} as Record<string, number>,
        ),
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
