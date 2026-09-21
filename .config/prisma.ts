import { defineConfig } from 'prisma/config';
import { getConnectionString } from '../src/lib/getConnectionString.ts';

export default defineConfig({
  schema: '../prisma/',
  migrations: {
    path: '../prisma/migrations',
  },
  datasource: {
    url: await getConnectionString(),
  },
});
