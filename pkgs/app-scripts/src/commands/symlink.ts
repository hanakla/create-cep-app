import os from "os";
import { readFile, unlink, symlink } from "fs/promises";
import path from "path";
import chalk from "chalk";
import { assertProjectRoot } from "../utils/assertProjectRoot";
import { pkgJson } from "../utils/runtimePackageJson";

export const symlinkCommand = async () => {
  assertProjectRoot();

  const packageJson = JSON.parse(
    await readFile(path.posix.join(process.cwd(), pkgJson), {
      encoding: "utf-8",
    })
  );
  const { name } = packageJson;

  const extensionSourcePath = path.posix.join(process.cwd());

  let symlinkPath: string | null = null;
  if (os.platform() === "darwin") {
    symlinkPath = path.posix.join(
      os.homedir(),
      `./Library/Application Support/Adobe/CEP/extensions/${name}`
    );
  } else if (os.platform() === "win32") {
    if (process.arch === "x64") {
      symlinkPath = `C:\\Program Files (x86)\\Common Files\\Adobe\\CEP\\extensions\\${name}`;
    } else {
      symlinkPath = `C:\\Program Files\\Common Files\\Adobe\\CEP\\extensions\\${name}`;
    }
  }

  if (symlinkPath == null)
    throw new Error(`Unexpected platform ${os.platform()} / ${process.arch}`);

  try {
    await unlink(symlinkPath);
  } catch {}

  try {
    await symlink(extensionSourcePath, symlinkPath!);
  } catch (err) {
    // when Windows and disable symlink
    if ((err as any).code === "EPERM") {
      try {
        await symlink(extensionSourcePath, symlinkPath!, "junction");
      } catch (e) {
        console.error(chalk.red.bold`Failed to create symlink: ${e.message}`);
        throw e;
      }
    }
  }

  console.log(chalk.green.bold`Extension Symlink created to ${symlinkPath!}`);
};
