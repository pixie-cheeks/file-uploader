import type { RequestHandler } from 'express';
import { prisma } from '../lib/prisma.ts';
import { BadRequestError, UnauthorizedError } from '../middleware/errors.ts';

const postFileUpload: RequestHandler = async (request, response) => {
  if (!request.user) throw new UnauthorizedError('Log in!');
  if (!request.file) throw new BadRequestError('File not uploaded');

  const { originalname, path, mimetype, size } = request.file;

  await prisma.file.create({
    data: { name: originalname, path, mimetype, size, userId: request.user.id },
  });
  response.redirect('/upload/file');
};

const getFileUpload: RequestHandler = (_request, response) => {
  response.render('upload/file', { title: 'Upload File' });
};

export { getFileUpload, postFileUpload };
