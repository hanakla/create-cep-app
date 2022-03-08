import os from "os";
import { readFileSync, unlinkSync, symlink } from "fs";
import path from "path";

const packageJson = JSON.parse(
  readFileSync(path.posix.join(__dirname, "../package.json"), {
    encoding: "utf-8",
  })
);
const { name } = packageJson;

const extensionSourcePath = path.posix.join(__dirname, "../");

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
  unlinkSync(symlinkPath);
} catch {}

symlink(extensionSourcePath, symlinkPath, (err) => {
  // when Windows and disable symlink
  if (err?.code === "EPERM") {
    symlink(extensionSourcePath, symlinkPath, "junction", (err) => {
      throw new Error();
    });
  }
});
