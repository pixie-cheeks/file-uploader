import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';
import { getConnectionString } from './getConnectionString.ts';

const adapter = new PrismaPg({ connectionString: await getConnectionString() });
const prisma = new PrismaClient({ adapter });

export { prisma };
