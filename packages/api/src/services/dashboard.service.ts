import { handlePrismaError } from "../middleware/error-handler";
import { type PrismaClient } from "@workspace/db";

export class DashboardService {
  constructor(private db: PrismaClient) {}

  async getOverview() {
    try {
      const now = new Date();
      const [
        totalUsers,
        totalStudents,
        totalExams,
        totalMcqs,
        recentStudents,
        recentExams,
        examStatuses,
        ongoingExams,
      ] = await Promise.all([
        this.db.user.count(),
        this.db.student.count(),
        this.db.exam.count(),
        this.db.mcq.count(),
        this.db.student.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
        }),
        this.db.exam.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
        }),
        this.db.exam.groupBy({
          by: ["status"],
          _count: {
            status: true,
          },
        }),
        this.db.exam.findMany({
          where: {
            startDate: { lte: now },
            OR: [{ endDate: null }, { endDate: { gt: now } }],
          },
          orderBy: { startDate: "asc" },
        }),
      ]);

      const examStatusDistribution = examStatuses.map((item) => ({
        status: item.status,
        count: item._count.status,
      }));

      return {
        stats: {
          totalUsers,
          totalStudents,
          totalExams,
          totalMcqs,
        },
        recentStudents,
        recentExams,
        examStatusDistribution,
        ongoingExams,
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
