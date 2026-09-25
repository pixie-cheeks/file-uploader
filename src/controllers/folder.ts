import { type RequestHandler } from 'express';
import { folderAddSchema, idParamaterSchema } from '../schemas/file.ts';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../middleware/errors.ts';
import { prisma } from '../lib/prisma.ts';
import type { FilledBodyHandler, FolderRouteHandler } from '../lib/types.ts';

const folderRouteMiddleware: FilledBodyHandler = async (
  request,
  _response,
  next,
) => {
  const parsedParameters = idParamaterSchema.safeParse(request.params);
  if (!parsedParameters.success) {
    throw new BadRequestError('Invalid folder ID given.');
  }
  const { id } = parsedParameters.data;
  const folder = await prisma.folder.findUnique({ where: { id } });
  if (!folder) throw new NotFoundError('No folder with this ID found.');

  if (folder.userId !== request.authenticatedUser.id)
    throw new UnauthorizedError(
      'You do not have the privileges to access this file',
    );

  request.params = parsedParameters.data;
  next();
};

const deleteFolder: FolderRouteHandler = async (request, response) => {
  await prisma.folder.delete({ where: { id: request.params.id } });

  response.send({ success: true });
};

const patchFolder: FolderRouteHandler = async (request, response) => {
  const parseResults = folderAddSchema.safeParse(request.body);
  if (!parseResults.success) {
    response.status(400).send({ errors: parseResults.error.issues });
    return;
  }

  await prisma.folder.update({
    where: { id: request.params.id },
    data: { name: parseResults.data.name },
  });

  response.send({ success: true });
};

const getFolder: RequestHandler = (_request, response) => {
  response.render('folder/home', { title: 'Folder' });
};
const getHomeFolder: RequestHandler = (_request, response) => {
  response.render('folder/home', { title: 'Home' });
};

export {
  getHomeFolder,
  getFolder,
  patchFolder,
  deleteFolder,
  folderRouteMiddleware,
};
