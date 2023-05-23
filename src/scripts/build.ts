import { exec, type ExecException } from "node:child_process";
import PrismaScheme from "../config/PrismaScheme";
import { readFile, writeFile } from "node:fs/promises";

(async () => {
  await changeDatabaseUrlInPrismaScheme();
  prismaGenerateScheme();
})();

function prismaGenerateScheme(): void {
  console.info("Running Prisma introspection");
  exec(
    "npx prisma db pull",
    (error: ExecException | null, stdout: string, stderr: string) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }
      if (stderr) {
        console.error(`Command execution failed with error: ${stderr}`);
        process.exit(1);
      }
      console.log(`${stdout}\n`);
      console.info("Generating Prima Client\n");
      exec(
        "npx prisma generate",
        (error: ExecException | null, stdout: string, stderr: string) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
          }
          if (stderr) {
            console.error(`Command execution failed with error: ${stderr}`);
            process.exit(1);
          }
          console.log(`${stdout}`);
          console.log("Compiling TypeScript");
          exec(
            "npx tsc src/app.ts --outDir ./dist --esModuleInterop",
            (error: ExecException | null, stdout: string, stderr: string) => {
              if (error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
              }
              if (stderr) {
                console.error(`Command execution failed with error: ${stderr}`);
                process.exit(1);
              }
              console.log(`${stdout}`);
              console.log("TypeScript Compiled");
              process.exit(0);
            }
          );
        }
      );
    }
  );
}

async function changeDatabaseUrlInPrismaScheme(): Promise<void> {
  const filePath = "prisma/schema.prisma";
  const postgreUrl = PrismaScheme.datasources.db.url;

  try {
    const oldData = await readFile(filePath);
    console.info("Preparing db.url at prisma.scheme\n");

    const newData = oldData
      .toString()
      .replace(/\$postgreUrl\$|"postgresql:\/\/.+/, `"${postgreUrl}"`);
    console.info("Writing new url\n");

    await writeFile(filePath, newData, { encoding: "utf-8" });
    console.info(`db.url updated. URL: ${postgreUrl}\n`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
