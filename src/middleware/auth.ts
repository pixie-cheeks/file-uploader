import type { NextFunction, Request, Response } from 'express';

const checkUnauth = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  if (request.isUnauthenticated()) {
    next();
    return;
  }

  response.redirect('/home');
};

const checkAuth = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  if (request.isAuthenticated()) {
    next();
    return;
  }

  response.redirect('/');
};

export { checkAuth, checkUnauth };
