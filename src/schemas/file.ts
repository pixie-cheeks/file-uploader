import * as z from 'zod';

export const fileDownloadSchema = z.object({
  id: z.string().nonempty().transform(Number),
});
