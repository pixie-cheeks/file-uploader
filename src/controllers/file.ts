import path from 'node:path';
import type { RequestHandler } from 'express';
import * as z from 'zod';
import { fileEditSchema, fileDownloadSchema } from '../schemas/file.ts';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../middleware/errors.ts';
import { prisma } from '../lib/prisma.ts';

const idParamaterSchema = z.object({
  id: z.string().trim().nonempty().transform(Number).pipe(z.number().gte(1)),
});

const deleteFile: RequestHandler = async (request, response) => {
  const parsedParameters = idParamaterSchema.safeParse(request.params);
  if (!parsedParameters.success) {
    throw new BadRequestError('Invalid file ID given.');
  }
  const { id } = parsedParameters.data;
  const file = await prisma.file.findUnique({ where: { id } });
  if (!file) throw new NotFoundError('No file with this ID found.');

  await prisma.file.delete({ where: { id } });
  response.send({ success: true });
};

const patchFile: RequestHandler = async (request, response) => {
  const parsedParameters = idParamaterSchema.safeParse(request.params);
  if (!parsedParameters.success) {
    throw new BadRequestError('Invalid file ID given.');
  }
  const { id } = parsedParameters.data;
  const file = await prisma.file.findUnique({ where: { id } });
  if (!file) throw new NotFoundError('No file with this ID found.');

  const parseResults = fileEditSchema.safeParse(request.body);
  if (!parseResults.success) {
    response.status(400).send({ errors: parseResults.error.issues });
    return;
  }

  await prisma.file.update({
    where: { id },
    data: parseResults.data,
  });

  response.send({ success: true });
};

const getFile: RequestHandler = async (request, response) => {
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

export { getFile, patchFile, deleteFile };
