import { PrismaClient } from "@prisma/client";
import PrismaScheme from "./PrismaScheme";

export const prisma = new PrismaClient(PrismaScheme);

process.on('exit', async () => {
  console.info('Server shutdown');
  console.info('Closing Prisma Client');

  await prisma.$disconnect();

  console.info('Prisma clossed', 'Good Bye');
});
