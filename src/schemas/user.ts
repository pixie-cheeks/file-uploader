import * as z from 'zod';
import { prisma } from '../lib/prisma.ts';
import { validatePassword } from '../lib/passwordUtilities.ts';

const errorIsRequired = 'is required';

const userCreationSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .nonempty({ error: `First Name ${errorIsRequired}` }),
    lastName: z
      .string()
      .trim()
      .nonempty({ error: `Last Name ${errorIsRequired}` }),
    username: z
      .string()
      .trim()
      .nonempty({ error: `Username ${errorIsRequired}` }),
    password: z
      .string()
      .trim()
      .nonempty({ error: `Password ${errorIsRequired}` }),
    confirmPassword: z
      .string()
      .trim()
      .nonempty({ error: `Confirm Password ${errorIsRequired}` }),
  })
  .superRefine(({ confirmPassword, password }, context) => {
    if (confirmPassword === password) return;

    context.addIssue({
      code: 'custom',
      message: 'The passwords did not match',
      path: ['confirmPassword'],
    });
  });

const uniqueUserCreationSchema = userCreationSchema.superRefine(
  async ({ username }, context) => {
    const didUsernameExist = Boolean(
      await prisma.user.findUnique({ where: { username } }),
    );

    if (!didUsernameExist) return;

    context.addIssue({
      code: 'custom',
      message: 'The given username has already been used',
      path: ['username'],
    });
  },
);

const loginSchema = z
  .object({
    username: z.string().trim().nonempty({ error: 'Username is required.' }),
    password: z.string().trim().nonempty({ error: 'Password is required.' }),
  })
  .superRefine(async ({ username, password }, context) => {
    if (username === '') return;

    const user = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    if (!user) {
      context.addIssue({
        code: 'custom',
        message: 'The given username does not exist',
        path: ['username'],
      });

      return;
    }

    if (password === '') return;

    if (!(await validatePassword(password, user.password))) {
      context.addIssue({
        code: 'custom',
        message: 'Incorrect password!',
        path: ['password'],
      });
    }
  });

export { uniqueUserCreationSchema, loginSchema };
