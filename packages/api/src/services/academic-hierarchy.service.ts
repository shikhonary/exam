import { PrismaClient } from "../trpc/context";

export class AcademicHierarchyService {
  constructor(private readonly db: PrismaClient) {}

  async getTree() {
    // Fetch all classes and their nested relationships.
    // Assuming we want active items by default.
    const classes = await this.db.academicClass.findMany({
      where: { isActive: true },
      orderBy: { position: "asc" },
      include: {
        classSubjects: {
          orderBy: { position: "asc" },
          include: {
            academicSubject: {
              include: {
                chapters: {
                  where: { isActive: true },
                  orderBy: { position: "asc" },
                  include: {
                    topics: {
                      where: { isActive: true },
                      orderBy: { position: "asc" },
                      include: {
                        subtopics: {
                          where: { isActive: true },
                          orderBy: { position: "asc" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return classes;
  }
}
