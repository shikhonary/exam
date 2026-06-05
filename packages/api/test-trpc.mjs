import 'dotenv/config';
import { basePrisma } from '../db/src/client.js';
import { TenantService } from './src/services/tenant.service.ts';

const srv = new TenantService(basePrisma);
srv.list({ page: 1, limit: 10 }).then(data => {
  console.log(JSON.stringify(data, null, 2));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
