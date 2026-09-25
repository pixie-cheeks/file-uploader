import type { Express } from 'express';
import { Router } from 'express';
import { checkAuth } from '../middleware/auth.ts';
import {
  getFile,
  patchFile,
  deleteFile,
  fileRouteMiddleware,
} from '../controllers/file.ts';

export const setupFileRoutes = (app: Express): void => {
  const router = Router();

  router.use(checkAuth);
  router.use(fileRouteMiddleware);

  router.patch('/:id/delete', deleteFile);
  router.patch('/:id/edit', patchFile);
  router.get('/:id', getFile);

  app.use('/file', router);
};
