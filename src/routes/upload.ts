import { Router } from 'express';
import { getFileUpload, postFileUpload } from '../controllers/upload.ts';
import { upload } from '../middleware/multer.ts';
import { checkAuth } from '../middleware/auth.ts';

const router = Router();

export const createUploadRouter = (): Router => {
  router.use(checkAuth);
  router.post('/file', upload.single('uploadFile'), postFileUpload);
  router.get('/file', getFileUpload);

  return router;
};
