import { exec, type ExecException } from "node:child_process";

prismaGenerateScheme();

function prismaGenerateScheme(): void {
  console.info("Creating Database...");
  exec(
    "npx prisma migrate dev --name openmusic",
    (error: ExecException | null, stdout: string, stderr: string) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }
      if (stderr) {
        console.error(`Command execution failed with error: ${stderr}`);
        process.exit(1);
      }
      console.info(`${stdout}\n`);
      console.info("Compiling TypeScript...");
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
          console.info(`${stdout}`);
          console.info("TypeScript Compiled");
          process.exit(0);
        }
      );
    }
  );
}
