#!/usr/bin/env node

import "esbuild-register";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { manifestCommand } from "./commands/manifest";
import { packCommand } from "./commands/pack";
import { symlinkCommand } from "./commands/symlink";
import { watchCommand } from "./commands/watch";

const r = eval("require"); // Escape from ncc's require handling
r(r.resolve("ts-node", { paths: [process.cwd()] })).register({
  transpileOnly: true,
});

yargs(hideBin(process.argv))
  .command(
    "pack",
    "Packaging app to zip",
    (y) => y,
    () => {
      packCommand();
    }
  )
  .command(
    "watch",
    "Watching changes",
    (y) => y,
    () => {
      watchCommand();
    }
  )
  .command(
    "manifest",
    "Build manifest.xml",
    (y) => y,
    () => {
      manifestCommand();
    }
  )
  .command(
    "symlink",
    "Create symlink to user CEP/extensions dir",
    (y) => y,
    () => {
      symlinkCommand();
    }
  )
  .demandCommand()
  .parse();
