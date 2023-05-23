import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

process.on('exit', async () => {
  console.info('Server shutdown');
  console.info('Closing Prisma Client');

  await prisma.$disconnect();

  console.info('Prisma clossed', 'Good Bye');
});
