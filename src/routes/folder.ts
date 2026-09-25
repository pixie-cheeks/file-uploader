import type { Express } from 'express';
import { Router } from 'express';
import { checkAuth } from '../middleware/auth.ts';
import {
  getHomeFolder,
  getFolder,
  patchFolder,
  deleteFolder,
} from '../controllers/folder.ts';

export const setupFolderRoutes = (app: Express): void => {
  const router = Router();

  router.use(checkAuth);

  router.patch('/:id/delete', deleteFolder);
  router.patch('/:id/edit', patchFolder);
  router.get('/:id', getFolder);

  app.use('/folder', router);

  app.get('/home', getHomeFolder);
};
