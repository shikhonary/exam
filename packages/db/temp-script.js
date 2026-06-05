const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_gv5MuEjdtf0J@ep-spring-cell-ao3of571-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require'
    }
  }
});

async function main() {
  const mcqs = await db.mcq.findMany({ take: 5, select: { id: true, options: true, answer: true } });
  console.log(JSON.stringify(mcqs, null, 2));
}

main().finally(() => db.$disconnect());
