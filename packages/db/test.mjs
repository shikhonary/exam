import { PrismaClient } from './master-client-types/index.js';

const db = new PrismaClient();
db.tenant.findMany().then(d => {
  console.log(JSON.stringify(d, null, 2));
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
