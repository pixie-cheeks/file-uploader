import type { Express } from 'express';
import { NotFoundError } from '../middleware/errors.ts';

export const setupRoutes = (app: Express): void => {
  app.get('/', (_request, response) => {
    response.render('index', { title: 'home' });
  });
  app.get('/*all', (_request, _response, next) => {
    next(new NotFoundError('Page not found'));
  });
};
