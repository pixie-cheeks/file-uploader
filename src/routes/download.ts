import { Router } from 'express';
import { getFileDownload } from '../controllers/download.ts';

const router = Router();

export const createDownloadRouter = (): Router => {
  router.get('/file', getFileDownload);

  return router;
};
