import { defineConfig } from 'prisma/config';
import { parsedEnvironment } from '../src/lib/parsedEnvironment.ts';

export default defineConfig({
  schema: '../prisma/',
  migrations: {
    path: '../prisma/migrations',
  },
  datasource: {
    url:
      parsedEnvironment.DB_ENV === 'development'
        ? process.env.DATABASE_URL
        : '',
  },
});
