import cpy from "cpy";
import { rm } from "fs/promises";
import path from "path";
import { zip } from "zip-a-folder";

const { name: appName, version } = require("../package.json");
const appPath = path.posix.join(__dirname, "../");
const tmpPath = path.posix.join(appPath, "tmp/package");

cpy(["./CSXS", "./dist", "./icons", "./package.json"], "tmp/package", {
  markDirectories: true,
  cwd: appPath,
})
  .then(() => {
    return zip(
      path.posix.join(appPath, "tmp/package"),
      path.posix.join(appPath, `${appName}-${version}.release.zip`)
    );
  })
  .then(() => {
    return rm(tmpPath, { recursive: true, force: true });
  });
