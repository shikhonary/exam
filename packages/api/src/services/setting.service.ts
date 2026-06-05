import { type PrismaClient } from "@workspace/db";
import { handlePrismaError } from "../middleware/error-handler";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  type ListSettingInputType,
  type UpdateSettingInputType,
} from "../shared/input/setting";
import { type SettingFormValues } from "@workspace/schema";

export class SettingService {
  constructor(private db: PrismaClient) {}

  async list(input: ListSettingInputType) {
    try {
      const where = buildWhere(input, ["key", "value", "category"]);

      if (input.category) {
        where.category = input.category;
      }

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.systemSetting.findMany({
          where,
          orderBy,
          ...pagination,
        }),
        this.db.systemSetting.count({ where }),
      ]);

      return { items, total };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getByKey(key: string) {
    try {
      return await this.db.systemSetting.findUnique({
        where: { key },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async upsert(input: SettingFormValues) {
    try {
      return await this.db.systemSetting.upsert({
        where: { key: input.key },
        create: input,
        update: {
          value: input.value,
          type: input.type,
          description: input.description,
          category: input.category,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(input: UpdateSettingInputType) {
    try {
      const { id, ...data } = input;
      return await this.db.systemSetting.update({
        where: { id },
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkUpdate(settings: { key: string; value: string }[]) {
    try {
      const updates = settings.map((s) =>
        this.db.systemSetting.update({
          where: { key: s.key },
          data: { value: s.value },
        })
      );
      return await this.db.$transaction(updates);
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string) {
    try {
      return await this.db.systemSetting.delete({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
