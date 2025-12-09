const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'test') {
  const { PrismaPg } = require('@prisma/adapter-pg');
  const { Pool } = require('pg');
  const pool = new Pool({
    user: 'user',
    password: 'password',
    host: 'localhost',
    port: 5432,
    database: 'nps_db',
  });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  const { PrismaPg } = require('@prisma/adapter-pg');
  const { Pool } = require('pg');
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
}

module.exports = prisma;
