const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

beforeAll(async () => {
  const pool = new Pool({
    user: 'user',
    password: 'password',
    host: 'localhost',
    port: 5432,
    database: 'nps_db',
  });
  const adapter = new PrismaPg(pool);
  global.prisma = new PrismaClient({ adapter });

  // Clean up tables
  try {
    await global.prisma.response.deleteMany();
    await global.prisma.campaign.deleteMany();
    await global.prisma.user.deleteMany();
  } catch (error) {
    // Tables might not exist, ignore
  }
});

afterAll(async () => {
  if (global.prisma) {
    await global.prisma.$disconnect();
  }
});
