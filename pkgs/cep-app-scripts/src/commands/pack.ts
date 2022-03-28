import cpy from "cpy";
import { readFileSync } from "fs";
import { rm } from "fs/promises";
import path from "path";
import { zip } from "zip-a-folder";
import { assertProjectRoot } from "../utils/assertProjectRoot";
import { pkgJson } from "../utils/runtimePackageJson";
import mkdirp from "mkdirp";

export const packCommand = async () => {
  assertProjectRoot();

  const appPath = path.posix.join(process.cwd());
  const { name: appName, version } = JSON.parse(
    readFileSync(path.posix.join(appPath, pkgJson), { encoding: "utf-8" })
  );
  const tmpPath = path.posix.join(appPath, "tmp/package");

  cpy(["./CSXS", "./dist", "./icons", "./package.json"], "tmp/package", {
    markDirectories: true,
    cwd: appPath,
  })
    .then(() => {
      return mkdirp(path.posix.join(appPath, "releases"));
    })
    .then(() => {
      return zip(
        path.posix.join(appPath, "tmp/package"),
        path.posix.join(appPath, `releases/${appName}-${version}.release.zip`)
      );
    })
    .then(() => {
      return rm(tmpPath, { recursive: true, force: true });
    });
};
