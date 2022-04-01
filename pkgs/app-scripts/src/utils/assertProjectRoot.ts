import { existsSync } from "fs";
import path from "path";
import { pkgJson } from "./runtimePackageJson";

export const assertProjectRoot = () => {
  if (!existsSync(path.posix.join(process.cwd(), pkgJson))) {
    console.error("This command must be running on app root dir.");
    process.exit(1);
  }
};
