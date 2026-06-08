import { z } from "zod";
import { type TenantClient, type PrismaClient } from "@workspace/db";
import { handlePrismaError } from "../middleware/error-handler";
import {
  counterFormSchema,
  uuidSchema,
  CounterFormValues,
} from "@workspace/schema";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  idInputType,
  listInputType,
  updateCounterInputType,
  getNextStudentIdInputType,
} from "../shared/input/counter";

export class CounterService {
  constructor(
    private db: TenantClient,
    private mainDb: PrismaClient,
  ) {}

  async list(input: listInputType) {
    try {
      const where = buildWhere(input, ["academicYear", "type"]);
      if (input.academicYearId) where.academicYearId = input.academicYearId;
      if (input.type) where.type = input.type;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.counter.findMany({
          where,
          orderBy,
          ...pagination,
        }),
        this.db.counter.count({ where }),
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
      return await this.db.counter.findUnique({
        where: { id: validatedId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: CounterFormValues) {
    try {
      const data = counterFormSchema.parse(input);
      
      const academicYear = await this.mainDb.academicYear.findUnique({
        where: { id: data.academicYearId },
      });
      if (!academicYear) throw new Error("Academic year not found");

      return await this.db.counter.create({
        data: {
          ...data,
          academicYear: academicYear.label,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(input: updateCounterInputType) {
    try {
      const { id, ...data } = input;
      
      const currentCounter = await this.db.counter.findUnique({ where: { id } });
      if (!currentCounter) throw new Error("Counter not found");

      let yearNameToUpdate: string | undefined = undefined;
      if (data.academicYearId !== undefined && data.academicYearId !== currentCounter.academicYearId) {
        const academicYear = await this.mainDb.academicYear.findUnique({
          where: { id: data.academicYearId },
        });
        if (academicYear) {
          yearNameToUpdate = academicYear.label;
        }
      }

      return await this.db.counter.update({
        where: { id },
        data: {
          ...data,
          ...(yearNameToUpdate ? { academicYear: yearNameToUpdate } : {}),
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(input: idInputType) {
    try {
      const validatedId = uuidSchema.parse(input);
      return await this.db.counter.delete({ where: { id: validatedId } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDelete(ids: string[]) {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.counter.deleteMany({
        where: { id: { in: validatedIds } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getNextStudentId(input: getNextStudentIdInputType) {
    try {
      const academicYear = await this.mainDb.academicYear.findUnique({
        where: { id: input.academicYearId },
      });
      if (!academicYear) throw new Error("Academic year not found");

      const academicClass = await this.mainDb.academicClass.findUnique({
        where: { id: input.academicClassId },
      });
      if (!academicClass) throw new Error("Academic class not found");

      const counter = await this.db.counter.findFirst({
        where: {
          academicYearId: input.academicYearId,
          type: academicClass.nameBn,
        },
      });

      const nextValue = counter ? counter.value + 1 : 1;
      return nextValue.toString();
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
