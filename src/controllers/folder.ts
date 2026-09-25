import type { RequestHandler } from 'express';
import * as z from 'zod';
import { folderAddSchema } from '../schemas/file.ts';
import { BadRequestError, NotFoundError } from '../middleware/errors.ts';
import { prisma } from '../lib/prisma.ts';
// import { prisma } from '../lib/prisma.ts';
// import { BadRequestError } from '../middleware/errors.ts';

const idParamaterSchema = z.object({
  id: z.string().trim().nonempty().transform(Number).pipe(z.number().gte(1)),
});

const deleteFolder: RequestHandler = async (request, response) => {
  const parsedParameters = idParamaterSchema.safeParse(request.params);
  if (!parsedParameters.success) {
    throw new BadRequestError('Invalid folder ID given.');
  }
  const { id } = parsedParameters.data;
  const folder = await prisma.folder.findUnique({ where: { id } });
  if (!folder) throw new NotFoundError('No folder with this ID found.');

  await prisma.folder.delete({ where: { id } });
  response.send({ success: true });
};

const patchFolder: RequestHandler = async (request, response) => {
  const parsedParameters = idParamaterSchema.safeParse(request.params);
  if (!parsedParameters.success) {
    throw new BadRequestError('Invalid folder ID given.');
  }
  const { id } = parsedParameters.data;
  const folder = await prisma.folder.findUnique({ where: { id } });
  if (!folder) throw new NotFoundError('No folder with this ID found.');

  const parseResults = folderAddSchema.safeParse(request.body);
  if (!parseResults.success) {
    response.status(400).send({ errors: parseResults.error.issues });
    return;
  }

  await prisma.folder.update({
    where: { id },
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

export { getHomeFolder, getFolder, patchFolder, deleteFolder };
