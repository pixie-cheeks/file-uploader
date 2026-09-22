import path from 'node:path';
import type { RequestHandler } from 'express';
import { prisma } from '../lib/prisma.ts';
import { BadRequestError, UnauthorizedError } from '../middleware/errors.ts';
import { fileDownloadSchema } from '../schemas/file.ts';

const getFileDownload: RequestHandler = async (request, response) => {
  const parseResults = fileDownloadSchema.safeParse(request.query);
  if (!parseResults.success) throw new BadRequestError('Invalid ID given');

  const file = await prisma.file.findUnique({
    where: { id: parseResults.data.id },
  });
  if (!file) throw new BadRequestError('File with this ID does not exist');

  if (file.userId !== request.authenticatedUser.id)
    throw new UnauthorizedError(
      'You do not have the privileges to access this file',
    );

  response.download(
    path.join(import.meta.dirname, '../..', file.path),
    file.name,
  );
};

export { getFileDownload };
