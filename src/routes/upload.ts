import type { Express } from 'express';
import { Router } from 'express';
import { checkAuth } from '../middleware/auth.ts';
import { postFileUpload } from '../controllers/upload.ts';
import { upload } from '../middleware/multer.ts';

export const setupUploadRoutes = (app: Express): void => {
  const router = Router();

  router.use(checkAuth);

  router.post('/file', upload.single('uploadFile'), postFileUpload);

  app.use('/upload', router);
};
