import { type Express } from 'express';
import { NotFoundError } from '../middleware/errors.ts';
import { checkAuth, checkUnauth } from '../middleware/auth.ts';
import {
  getLogout,
  getLoginPage,
  postLoginPage,
  getSignupPage,
  createUser,
} from '../controllers/userAuthentication.ts';
import { setupUploadRoutes } from './upload.ts';

export const setupRoutes = (app: Express): void => {
  setupUploadRoutes(app);

  app.get('/log-out', checkAuth, getLogout);

  app.post('/log-in', checkUnauth, postLoginPage);
  app.get('/log-in', checkUnauth, getLoginPage);

  app.post('/sign-up', checkUnauth, createUser);
  app.get('/sign-up', checkUnauth, getSignupPage);

  app.get('/', (_request, response) => {
    response.render('index', { title: 'home' });
  });

  app.get('/*all', (request, _response, next) => {
    console.log('path:', request.path);
    next(new NotFoundError('Page not found'));
  });
};
