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

export const folderAddSchema = z.object({
  parentFolderId: z
    .string()
    .trim()
    .nonempty('Parent Folder ID is empty')
    .transform(Number)
    .optional(),
  name: z.string().trim().nonempty('Folder Name is required'),
});
