import { prisma } from './lib/prisma.ts';

const allPosts = await prisma.user.findMany();
console.log(allPosts);

await prisma.$disconnect();
