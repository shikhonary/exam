import { prisma } from './src/client.js';

async function main() {
  const plans = [
    {
      name: 'basic',
      displayName: 'Basic Plan',
      description: 'Perfect for small coaching centers',
      monthlyPriceBDT: 1000,
      yearlyPriceBDT: 10000,
      features: ['Basic Reporting', 'Email Support'],
      defaultStudentLimit: 100,
      defaultTeacherLimit: 5,
      defaultExamLimit: 50,
      defaultStorageLimit: 500,
      isPopular: false
    },
    {
      name: 'pro',
      displayName: 'Pro Plan',
      description: 'Ideal for growing schools',
      monthlyPriceBDT: 3000,
      yearlyPriceBDT: 30000,
      features: ['Advanced Analytics', 'Priority Support', 'Custom Domain'],
      defaultStudentLimit: 500,
      defaultTeacherLimit: 20,
      defaultExamLimit: 200,
      defaultStorageLimit: 2000,
      isPopular: true
    },
    {
      name: 'enterprise',
      displayName: 'Enterprise',
      description: 'For large educational institutions',
      monthlyPriceBDT: 10000,
      yearlyPriceBDT: 100000,
      features: ['Dedicated Account Manager', 'White-labeling', 'SLA'],
      defaultStudentLimit: 5000,
      defaultTeacherLimit: 100,
      defaultExamLimit: 1000,
      defaultStorageLimit: 10000,
      isPopular: false
    }
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan
    });
  }
  console.log('Dummy plans seeded successfully!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  process.exit(0);
});