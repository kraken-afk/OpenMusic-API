import { PrismaClient } from "@prisma/client";
import PrismaClientScheme from "./PrimaCLientScheme";

export const prisma = new PrismaClient(PrismaClientScheme);

process.on('exit', async () => {
  console.info('Server shutdown');
  console.info('Closing Prisma Client');

  await prisma.$disconnect();

  console.info('Prisma clossed', 'Good Bye');
});
