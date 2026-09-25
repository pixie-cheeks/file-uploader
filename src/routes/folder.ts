import type { Express } from 'express';
import { Router } from 'express';
import { checkAuth } from '../middleware/auth.ts';
import {
  getHomeFolder,
  getFolder,
  patchFolder,
  deleteFolder,
  folderRouteMiddleware,
} from '../controllers/folder.ts';

export const setupFolderRoutes = (app: Express): void => {
  const router = Router();

  router.use(checkAuth);
  router.use(folderRouteMiddleware);

  router.patch('/:id/delete', deleteFolder);
  router.patch('/:id/edit', patchFolder);
  router.get('/:id', getFolder);

  app.get('/home', getHomeFolder);
  app.use('/folder', router);
};
