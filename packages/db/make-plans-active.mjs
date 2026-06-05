import { basePrisma } from './src/client.js';

async function main() {
  await basePrisma.subscriptionPlan.updateMany({
    data: { isActive: true }
  });
  console.log("Updated plans to be active");
}

main().catch(console.error).finally(() => process.exit(0));
