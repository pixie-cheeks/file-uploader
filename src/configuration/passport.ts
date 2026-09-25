/* eslint-disable unicorn/no-null */
import type { Express } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { validatePassword } from '../lib/passwordUtilities.ts';
import { prisma } from '../lib/prisma.ts';

const strategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({
      include: { files: true, folders: true },
      where: { username: username.trim() },
    });

    if (!user) {
      done(null, false, { message: "The given user doesn't exist." });
      return;
    }

    if (!(await validatePassword(password.trim(), user.password))) {
      done(null, false, { message: 'Incorrect password!' });
      return;
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
});

const setupPassport = (app: Express): void => {
  app.use(passport.session());

  passport.use(strategy);

  passport.serializeUser((user: { id?: number }, done) => {
    if (!user.id) throw new Error('User ID not found in passport.');
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      if (typeof id !== 'number')
        throw new Error('Invalid ID given when deserializing user.');
      const user = await prisma.user.findUnique({
        include: { files: true, folders: true },
        where: { id },
      });

      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.use((request, response, next) => {
    if (request.user) request.authenticatedUser = request.user;
    response.locals.currentUser = request.user;
    next();
  });
};

export { setupPassport };
