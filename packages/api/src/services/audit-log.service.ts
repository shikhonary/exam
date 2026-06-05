import { type PrismaClient } from "@workspace/db";
import { handlePrismaError } from "../middleware/error-handler";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import { type ListAuditLogInputType } from "../shared/input/audit-log";

export class AuditLogService {
  constructor(private db: PrismaClient) {}

  async list(input: ListAuditLogInputType) {
    try {
      const where = buildWhere(input, ["action", "entity", "description"]);

      if (input.action) where.action = input.action;
      if (input.entity) where.entity = input.entity;
      if (input.userId) where.userId = input.userId;
      if (input.tenantId) where.tenantId = input.tenantId;

      const orderBy = buildOrderBy(input) || { createdAt: "desc" };
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.auditLog.findMany({
          where,
          orderBy,
          ...pagination,
        }),
        this.db.auditLog.count({ where }),
      ]);

      const userIds = [...new Set(items.map((i) => i.userId).filter(Boolean))] as string[];
      let userMap = new Map();
      if (userIds.length > 0) {
        const users = await this.db.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true, email: true },
        });
        userMap = new Map(users.map((u) => [u.id, u]));
      }

      const enrichedItems = items.map((item) => ({
        ...item,
        user: item.userId ? userMap.get(item.userId) || null : null,
      }));

      return { items: enrichedItems, total };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(id: string) {
    try {
      return await this.db.auditLog.findUnique({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
