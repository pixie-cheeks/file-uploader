// Disabling this rule because shell.js doesn't work nicely when imported
// the correct way
/* eslint-disable import-x/no-named-as-default-member */
import shell from 'shelljs';

console.log('Cleaning the build folder.');
shell.rm('-rf', ['dist']);
console.log('Done cleaning.');

console.log('Generating Prisma client code...');
shell.exec('prisma generate');
console.log('Generated!');

console.log('Build JS files from TS files.');
shell.exec('tsc -p .config/tsconfig.build.json');
console.log('Done building JS files.');

// console.log('Build styles with postcss.');
// shell.exec(
//   'postcss src/styles/style.css --dir src/public/styles --map --env production',
// );
// console.log('Done building styles.');

console.log('Copy other assets.');
shell.cp('-R', ['src/views', 'src/public'], 'dist/');
console.log('Done copying assets.');
