import { existsSync } from "fs";
import path from "path";

export const isProjectRoot = () => {
  return existsSync(path.posix.join(process.cwd(), "package.json"));
};
