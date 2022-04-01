#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { createCommand } from "./commands/create";

yargs(hideBin(process.argv))
  .command(
    "$0",
    "Create Project",
    (yargs) => yargs.option("use-npm", { type: "boolean", default: false }),
    ({ useNpm, _ }) => {
      createCommand({ appName: _[0] as string, useNpm });
    }
  )
  .demandCommand()
  .parse();
