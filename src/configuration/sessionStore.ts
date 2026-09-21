import session from 'express-session';
import type { Express } from 'express';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { prisma } from '../lib/prisma.ts';
import { parsedEnvironment } from '../lib/parsedEnvironment.ts';

const sessionStore = new PrismaSessionStore(prisma, {
  checkPeriod: 2 * 60 * 1_000, // 2 minutes
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

export const setupSessionStore = (app: Express): void => {
  app.use(
    session({
      secret: parsedEnvironment.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: sessionStore,
      cookie: {
        maxAge: 1_000 * 60 * 60 * 24, // 1 day or 24 hours
      },
    }),
  );
};
