import type { Express } from 'express';
import { Router } from 'express';
import { checkAuth } from '../middleware/auth.ts';

export const setupFolderRoutes = (app: Express): void => {
  const router = Router();

  router.use(checkAuth);

  router.get('/:id');

  app.use('/folder', router);
};
