import { type PrismaClient } from "@workspace/db";
import { handlePrismaError } from "../middleware/error-handler";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  type ListNotificationInputType,
  type UpdateNotificationInputType,
} from "../shared/input/notification";
import { type NotificationFormValues } from "@workspace/schema";

export class NotificationService {
  constructor(private db: PrismaClient) {}

  async list(input: ListNotificationInputType) {
    try {
      const where = buildWhere(input, ["title", "message"]);

      if (input.read !== undefined && input.read !== null) {
        where.read = input.read;
      }
      if (input.type) where.type = input.type;
      if (input.userId) where.userId = input.userId;
      if (input.tenantId) where.tenantId = input.tenantId;

      // Generally, list queries should fallback to descending createdAt
      const orderBy = buildOrderBy(input) || { createdAt: "desc" };
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.notification.findMany({
          where,
          orderBy,
          ...pagination,
        }),
        this.db.notification.count({ where }),
      ]);

      return { items, total };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(id: string) {
    try {
      return await this.db.notification.findUnique({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: NotificationFormValues) {
    try {
      return await this.db.notification.create({
        data: input,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(input: UpdateNotificationInputType) {
    try {
      const { id, ...data } = input;
      return await this.db.notification.update({
        where: { id },
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async markAsRead(id: string) {
    try {
      return await this.db.notification.update({
        where: { id },
        data: { read: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async markAllAsRead(userId: string): Promise<{ count: number } | void> {
    try {
      return await this.db.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string) {
    try {
      return await this.db.notification.delete({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
