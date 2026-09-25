import type { RequestHandler } from 'express';
import { prisma } from '../lib/prisma.ts';
import { BadRequestError } from '../middleware/errors.ts';
import { folderAddSchema } from '../schemas/file.ts';

type FilledBodyHandler = RequestHandler<
  unknown,
  unknown,
  Record<string, string>
>;

const postFileUpload: RequestHandler = async (request, response) => {
  if (!request.file) throw new BadRequestError('File not uploaded');

  const { originalname, path, mimetype, size } = request.file;

  await prisma.file.create({
    data: {
      name: originalname,
      path,
      mimetype,
      size,
      userId: request.authenticatedUser.id,
    },
  });
  response.send({ success: 'done!' });
};

const postFolderUpload: FilledBodyHandler = async (request, response) => {
  const parseResults = folderAddSchema.safeParse(request.body);

  if (!parseResults.success) {
    response.status(400).send({ errors: parseResults.error.issues });
    return;
  }

  await prisma.folder.create({
    data: {
      parentFolderId: parseResults.data.parentFolderId,
      userId: request.authenticatedUser.id,
      name: parseResults.data.name,
    },
  });

  response.redirect('/');
};

export { postFileUpload, postFolderUpload };
