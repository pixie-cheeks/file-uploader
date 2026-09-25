import type { RequestHandler } from 'express';
import type { z } from 'zod';
import { idParamaterSchema } from '../schemas/file.ts';
import type { File } from '../generated/prisma/client.ts';

export type FilledBodyHandler = RequestHandler<
  unknown,
  unknown,
  Record<string, unknown>,
  unknown,
  Record<string, unknown>
>;

export type FileRouteHandler = RequestHandler<
  z.infer<typeof idParamaterSchema>,
  unknown,
  unknown,
  unknown,
  { file: File }
>;
