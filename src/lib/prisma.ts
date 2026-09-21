import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';
import { parsedEnvironment } from './parsedEnvironment.ts';

const connectionString =
  parsedEnvironment.DB_ENV === 'development'
    ? parsedEnvironment.DATABASE_URL
    : '';

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
