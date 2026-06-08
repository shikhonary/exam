import { z } from "zod";
import { type TenantClient, type PrismaClient } from "@workspace/db";
import { handlePrismaError } from "../middleware/error-handler";
import {
  monthlyFeeFormSchema,
  uuidSchema,
  MonthlyFeeFormValues,
} from "@workspace/schema";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  idInputType,
  listInputType,
  updateMonthlyFeeInputType,
} from "../shared/input/monthly-fee";

/**
 * Service for managing Monthly Fees (Tenant Level)
 */
export class MonthlyFeeService {
  constructor(
    private db: TenantClient,
    private mainDb: PrismaClient,
  ) {}

  async list(input: listInputType) {
    try {
      const where = buildWhere(input, ["academicYear", "className"]);
      if (input.academicYearId) where.academicYearId = input.academicYearId;
      if (input.academicClassId) where.academicClassId = input.academicClassId;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.monthlyFee.findMany({
          where,
          orderBy,
          ...pagination,
        }),
        this.db.monthlyFee.count({ where }),
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
      return await this.db.monthlyFee.findUnique({
        where: { id: validatedId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: MonthlyFeeFormValues) {
    try {
      const data = monthlyFeeFormSchema.parse(input);
      
      const existingFee = await this.db.monthlyFee.findFirst({
        where: { 
          academicYearId: data.academicYearId,
          academicClassId: data.academicClassId
        },
      });
      if (existingFee) {
        throw new Error("এই বছর এবং ক্লাসের জন্য ইতিমধ্যে একটি মাসিক ফি নির্ধারণ করা আছে।");
      }

      const academicClass = await this.mainDb.academicClass.findUnique({
        where: { id: data.academicClassId },
      });
      if (!academicClass) throw new Error("Academic class not found");
      
      const academicYear = await this.mainDb.academicYear.findUnique({
        where: { id: data.academicYearId },
      });
      if (!academicYear) throw new Error("Academic year not found");

      return await this.db.monthlyFee.create({
        data: {
          ...data,
          academicYear: academicYear.label,
          className: academicClass.nameBn,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(input: updateMonthlyFeeInputType) {
    try {
      const { id, ...data } = input;
      
      const currentFee = await this.db.monthlyFee.findUnique({ where: { id } });
      if (!currentFee) throw new Error("Monthly Fee not found");

      const yearToCheck = data.academicYearId !== undefined ? data.academicYearId : currentFee.academicYearId;
      const classIdToCheck = data.academicClassId !== undefined ? data.academicClassId : currentFee.academicClassId;

      const existingFee = await this.db.monthlyFee.findFirst({
        where: { 
          academicYearId: yearToCheck,
          academicClassId: classIdToCheck,
          id: { not: id }
        },
      });
      if (existingFee) {
        throw new Error("এই বছর এবং ক্লাসের জন্য ইতিমধ্যে একটি মাসিক ফি নির্ধারণ করা আছে।");
      }

      let classNameToUpdate: string | undefined = undefined;
      if (data.academicClassId !== undefined && data.academicClassId !== currentFee.academicClassId) {
        const academicClass = await this.mainDb.academicClass.findUnique({
          where: { id: data.academicClassId },
        });
        if (academicClass) {
          classNameToUpdate = academicClass.nameBn;
        }
      }

      let yearNameToUpdate: string | undefined = undefined;
      if (data.academicYearId !== undefined && data.academicYearId !== currentFee.academicYearId) {
        const academicYear = await this.mainDb.academicYear.findUnique({
          where: { id: data.academicYearId },
        });
        if (academicYear) {
          yearNameToUpdate = academicYear.label;
        }
      }

      return await this.db.monthlyFee.update({
        where: { id },
        data: {
          ...data,
          ...(classNameToUpdate ? { className: classNameToUpdate } : {}),
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
      return await this.db.monthlyFee.delete({ where: { id: validatedId } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDelete(ids: string[]) {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.monthlyFee.deleteMany({
        where: { id: { in: validatedIds } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
