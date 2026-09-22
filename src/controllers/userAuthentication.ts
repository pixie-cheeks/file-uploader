import { type NextFunction, type Request, type Response } from 'express';
import { loginSchema, uniqueUserCreationSchema } from '../schemas/user.ts';
import { hashPassword } from '../lib/passwordUtilities.ts';
import { prisma } from '../lib/prisma.ts';

type BodyRequest = Request<unknown, unknown, Record<string, string>>;

const getSignupPage = (_request: Request, response: Response): void => {
  response.render('sign-up', { title: 'Sign Up' });
};

const createUser = async (
  request: BodyRequest,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const parseResult = await uniqueUserCreationSchema.safeParseAsync(
    request.body,
  );

  if (!parseResult.success) {
    response.status(400).render('sign-up', {
      title: 'Sign Up',
      errors: parseResult.error.issues,
      givenBody: request.body,
    });
    return;
  }

  const { confirmPassword, password, ...userData } = parseResult.data;

  const user = await prisma.user.create({
    include: { files: true },
    data: {
      ...userData,
      password: await hashPassword(password),
    },
  });

  request.login(user, (error) => {
    if (error) {
      next(error);
      return;
    }
    response.redirect('/');
  });
};

const postLoginPage = async (
  request: BodyRequest,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const parseResults = await loginSchema.safeParseAsync(request.body);

  if (!parseResults.success) {
    response.status(400).render('log-in', {
      title: 'Log In',
      errors: parseResults.error.issues,
      givenBody: request.body,
    });
    return;
  }

  const user = await prisma.user.findUnique({
    include: { files: true },
    where: { username: parseResults.data.username },
  });

  if (!user) throw new Error('User is invalid somehow');

  request.login(user, (error) => {
    if (error) {
      next(error);
      return;
    }
    response.redirect('/');
  });
};

const getLoginPage = (_request: Request, response: Response): void => {
  response.render('log-in', { title: 'Log In' });
};

const getLogout = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  request.logout((error) => {
    if (error) {
      next(error);
      return;
    }
    response.redirect('/');
  });
};

export { getSignupPage, createUser, getLoginPage, getLogout, postLoginPage };
