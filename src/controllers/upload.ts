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
  response.redirect('/');
};

const postFolderUpload: FilledBodyHandler = async (request, response) => {
  const parseResults = folderAddSchema.safeParse(request.body);

  if (!parseResults.success) {
    response.render('upload/folder', {
      title: 'Add Folder',
      givenBody: request.body,
      errors: parseResults.error.issues,
    });
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

const getFileUpload: RequestHandler = (_request, response) => {
  response.render('upload/file', { title: 'Upload File' });
};

const getFolderUpload: RequestHandler = (_request, response) => {
  response.render('upload/folder', { title: 'Add Folder' });
};

export { getFileUpload, postFileUpload, getFolderUpload, postFolderUpload };
