import type { Express } from 'express';
import { NotFoundError } from '../middleware/errors.ts';
import { upload } from '../middleware/multer.ts';

export const setupRoutes = (app: Express): void => {
  app.post('/', upload.single('avatar'), (request, response) => {
    console.log({ file: request.file, body: request.body as object });
    response.redirect('/');
  });

  app.get('/', (_request, response) => {
    response.render('index', { title: 'home' });
  });

  app.get('/*all', (request, _response, next) => {
    console.log('params:', request.params.all);
    next(new NotFoundError('Page not found'));
  });
};
