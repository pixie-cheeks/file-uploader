import path from 'node:path';
import { fileEditSchema, idParamaterSchema } from '../schemas/file.ts';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../middleware/errors.ts';
import { prisma } from '../lib/prisma.ts';
import type { FileRouteHandler, FilledBodyHandler } from '../lib/types.ts';

const fileRouteMiddleware: FilledBodyHandler = async (
  request,
  response,
  next,
) => {
  const parsedParameters = idParamaterSchema.safeParse(request.params);
  if (!parsedParameters.success) {
    throw new BadRequestError('Invalid file ID given.');
  }

  const { id } = parsedParameters.data;
  const file = await prisma.file.findUnique({ where: { id } });
  if (!file) throw new NotFoundError('No file with this ID found.');

  if (file.userId !== request.authenticatedUser.id)
    throw new UnauthorizedError(
      'You do not have the privileges to access this file',
    );

  request.body.params = parsedParameters.data;
  response.locals.file = file;
  next();
};

const deleteFile: FileRouteHandler = async (request, response) => {
  await prisma.file.delete({ where: { id: request.params.id } });

  response.send({ success: true });
};

const patchFile: FileRouteHandler = async (request, response) => {
  const parseResults = fileEditSchema.safeParse(request.body);
  if (!parseResults.success) {
    response.status(400).send({ errors: parseResults.error.issues });
    return;
  }

  await prisma.file.update({
    where: { id: request.params.id },
    data: parseResults.data,
  });

  response.send({ success: true });
};

const getFile: FileRouteHandler = (_request, response) => {
  const { file } = response.locals;

  response.download(
    path.join(import.meta.dirname, '../..', file.path),
    file.name,
  );
};

export { getFile, patchFile, deleteFile, fileRouteMiddleware };
