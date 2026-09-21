import express, {
  static as expressStatic,
  urlencoded as expressUrlencoded,
} from 'express';
import path from 'node:path';
import expressLayouts from 'express-ejs-layouts';
import { errorHandler } from './middleware/errors.ts';
import { parsedEnvironment } from './lib/parsedEnvironment.ts';
import { setupSessionStore } from './configuration/sessionStore.ts';
import { setupPassport } from './configuration/passport.ts';

const { PORT } = parsedEnvironment;
const { dirname } = import.meta;

const app = express();

app.use(expressStatic(path.join(dirname, 'public')));
app.use(expressUrlencoded({ extended: true }));

// EJS setup
app.set('views', path.join(dirname, 'views'));
app.set('view engine', 'ejs');

// EJS-Layouts setup
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.use(expressLayouts);

setupSessionStore(app);
setupPassport(app);

// setupRoutes(app)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `Express app listening on port ${PORT}! http://localhost:${PORT}`,
  );
});
