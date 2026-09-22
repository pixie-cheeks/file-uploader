import type {
  User as CustomUser,
  File,
} from '../../generated/prisma/client.ts';

export {};

// Source - https://stackoverflow.com/a/73019858
// Posted by Alex Jukes
// Retrieved 2026-09-22, License - CC BY-SA 4.0

declare global {
  namespace Express {
    export interface User extends CustomUser {
      files: File[];
    }

    interface Request {
      /**
       * Warning! Even though typescript will tell you this exists everywhere,
       * this is only available in authenticated routes. I did this as a last
       * resort but there is probably a better solution.
       */
      authenticatedUser: User;
    }
  }
}
