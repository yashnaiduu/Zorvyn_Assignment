import { PrismaClient, Role, RecordType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 10;

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('admin123', BCRYPT_ROUNDS);
  const analystPassword = await bcrypt.hash('analyst123', BCRYPT_ROUNDS);
  const viewerPassword = await bcrypt.hash('viewer123', BCRYPT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@zorvyn.com' },
    update: {},
    create: {
      email: 'admin@zorvyn.com',
      password: adminPassword,
      name: 'Admin User',
      role: Role.ADMIN,
    },
  });

  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@zorvyn.com' },
    update: {},
    create: {
      email: 'analyst@zorvyn.com',
      password: analystPassword,
      name: 'Analyst User',
      role: Role.ANALYST,
    },
  });

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@zorvyn.com' },
    update: {},
    create: {
      email: 'viewer@zorvyn.com',
      password: viewerPassword,
      name: 'Viewer User',
      role: Role.VIEWER,
    },
  });

  const categories = ['Salary', 'Freelance', 'Rent', 'Utilities', 'Food', 'Transport', 'Healthcare', 'Entertainment'];

  const records = [];
  for (let i = 0; i < 20; i++) {
    const type = i % 3 === 0 ? RecordType.INCOME : RecordType.EXPENSE;
    const category = categories[i % categories.length];
    const amount = parseFloat((Math.random() * 5000 + 100).toFixed(2));
    const date = new Date(2025, i % 12, (i % 28) + 1);

    records.push({
      userId: i % 2 === 0 ? admin.id : analyst.id,
      amount,
      type,
      category,
      date,
      description: `${type === RecordType.INCOME ? 'Income' : 'Expense'} - ${category} (seed #${i + 1})`,
    });
  }

  for (const record of records) {
    await prisma.record.create({ data: record });
  }

  console.log(`Seeded: ${[admin.email, analyst.email, viewer.email].join(', ')}`);
  console.log(`Seeded: ${records.length} financial records`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
