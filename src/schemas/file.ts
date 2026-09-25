import * as z from 'zod';

export const fileDownloadSchema = z.object({
  id: z.string().trim().nonempty('ID is required').transform(Number),
});

export const fileUploadSchema = z.object({
  folderId: z
    .string()
    .trim()
    .nonempty('Folder ID is empty')
    .transform(Number)
    .optional(),
});

const requestNumber = z.string().trim().nonempty().transform(Number);

export const fileEditSchema = z
  .object({
    name: z.string().trim().nonempty(),
    type: z.string().trim().nonempty(),
    uploadedOn: z.date(),
    mimetype: z.string().trim().nonempty(),
    userId: requestNumber.pipe(z.number().gte(1)),
    path: z.string().trim().nonempty(),
    size: requestNumber.pipe(z.number().gte(0)),
  })
  .partial();

export const folderAddSchema = z.object({
  parentFolderId: z
    .string()
    .trim()
    .nonempty('Parent Folder ID is empty')
    .transform(Number)
    .optional(),
  name: z.string().trim().nonempty('Folder Name is required'),
});
