import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from './errors.ts';

const checkUnauth = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  if (request.isUnauthenticated()) {
    next();
    return;
  }

  response.redirect('/');
};

const checkAuth = (
  request: Request,
  _response: Response,
  next: NextFunction,
): void => {
  if (request.isAuthenticated()) {
    next();
    return;
  }

  throw new UnauthorizedError('No access. You need to log in!');
};

export { checkAuth, checkUnauth };
