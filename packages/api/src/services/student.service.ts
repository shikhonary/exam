import { z } from "zod";
import { type TenantClient, type PrismaClient } from "@workspace/db";
import { handlePrismaError } from "../middleware/error-handler";
import {
  studentFormSchema,
  uuidSchema,
  StudentFormValues,
} from "@workspace/schema";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  idInputType,
  listInputType,
  updateStudentInputType,
} from "../shared/input/student";

/**
 * Service for managing Students (Tenant Level)
 */
export class StudentService {
  constructor(
    private db: TenantClient,
    private mainDb: PrismaClient,
  ) {}

  async list(input: listInputType) {
    try {
      const where = buildWhere(input, ["name", "studentId", "roll", "primaryPhone"]);
      if (input.academicClassId) where.academicClassId = input.academicClassId;
      if (input.academicYearId) where.academicYearId = input.academicYearId;
      if (input.batchId) where.batchId = input.batchId;

      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.student.findMany({
          where,
          orderBy,
          ...pagination,
          include: {
            batch: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
        this.db.student.count({ where }),
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
      return await this.db.student.findUnique({
        where: { id: validatedId },
        include: {
          batch: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: StudentFormValues) {
    try {
      const data = studentFormSchema.parse(input);
      
      const existingStudent = await this.db.student.findFirst({
        where: { 
          studentId: data.studentId,
        },
      });
      if (existingStudent) {
        throw new Error("এই আইডির একজন শিক্ষার্থী ইতিমধ্যে বিদ্যমান।");
      }

      const academicClass = await this.mainDb.academicClass.findUnique({
        where: { id: data.academicClassId },
      });
      if (!academicClass) throw new Error("Academic class not found");

      const academicYear = await this.mainDb.academicYear.findUnique({
        where: { id: data.academicYearId },
      });
      if (!academicYear) throw new Error("Academic year not found");

      // Verify batch exists
      const batch = await this.db.batch.findUnique({
        where: { id: data.batchId },
      });
      if (!batch) throw new Error("Batch not found");

      let dob: Date | undefined = undefined;
      if (data.dateOfBirth) {
        dob = new Date(data.dateOfBirth);
      }

      // Handle the counter increment
      const counter = await this.db.counter.findFirst({
        where: {
          academicYearId: academicYear.id,
          type: academicClass.nameBn,
        },
      });

      if (counter) {
        await this.db.counter.update({
          where: { id: counter.id },
          data: { value: { increment: 1 } },
        });
      } else {
        await this.db.counter.create({
          data: {
            academicYearId: academicYear.id,
            academicYear: academicYear.label,
            type: academicClass.nameBn,
            value: 1,
          },
        });
      }

      return await this.db.student.create({
        data: {
          ...data,
          dateOfBirth: dob,
          academicYear: academicYear.label,
          className: academicClass.nameBn,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(input: updateStudentInputType) {
    try {
      const { id, ...data } = input;
      
      if (data.studentId !== undefined) {
        const currentStudent = await this.db.student.findUnique({ where: { id } });
        if (!currentStudent) throw new Error("Student not found");

        const studentIdToCheck = data.studentId !== undefined ? data.studentId : currentStudent.studentId;

        const existingStudent = await this.db.student.findFirst({
          where: { 
            studentId: studentIdToCheck,
            id: { not: id }
          },
        });
        if (existingStudent) {
          throw new Error("এই আইডির একজন শিক্ষার্থী ইতিমধ্যে বিদ্যমান।");
        }
      }

      // If academicClassId is being updated, we should also update className
      let classNameToUpdate: string | undefined = undefined;
      if (data.academicClassId !== undefined) {
        const academicClass = await this.mainDb.academicClass.findUnique({
          where: { id: data.academicClassId },
        });
        if (academicClass) {
          classNameToUpdate = academicClass.nameBn;
        }
      }

      // If academicYearId is being updated, update academicYear label
      let academicYearToUpdate: string | undefined = undefined;
      if (data.academicYearId !== undefined) {
        const academicYear = await this.mainDb.academicYear.findUnique({
          where: { id: data.academicYearId },
        });
        if (academicYear) {
          academicYearToUpdate = academicYear.label;
        }
      }

      let dob: Date | undefined = undefined;
      if (data.dateOfBirth) {
        dob = new Date(data.dateOfBirth);
      }

      return await this.db.student.update({
        where: { id },
        data: {
          ...data,
          ...(dob ? { dateOfBirth: dob } : {}),
          ...(classNameToUpdate ? { className: classNameToUpdate } : {}),
          ...(academicYearToUpdate ? { academicYear: academicYearToUpdate } : {}),
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(input: idInputType) {
    try {
      const validatedId = uuidSchema.parse(input);
      return await this.db.student.delete({ where: { id: validatedId } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async toggleActive(input: string) {
    try {
      const validatedId = uuidSchema.parse(input);
      const student = await this.db.student.findUnique({
        where: { id: validatedId },
      });

      if (!student) throw new Error("Student not found");

      return await this.db.student.update({
        where: { id: validatedId },
        data: { isActive: !student.isActive },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkDelete(ids: string[]) {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.student.deleteMany({
        where: { id: { in: validatedIds } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async bulkToggleActive(ids: string[], isActive: boolean) {
    try {
      const validatedIds = z.array(uuidSchema).parse(ids);
      return await this.db.student.updateMany({
        where: { id: { in: validatedIds } },
        data: { isActive },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
