#!/usr/bin/env node

// import { Command } from "commander";
// import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { manifestCommand } from "./commands/manifest";
import { createCommand } from "./commands/create";
import { symlinkCommand } from "./commands/symlink";

const argv = yargs(hideBin(process.argv))
  .command(
    "manifest",
    "build manifest.xml by cep.config.ts",
    (yargs) => {
      // return yargs.option("watch", {alias: 'w', });
    },
    (args) => {
      manifestCommand();
    }
  )
  .command(
    "sym",
    "Create symlink to this extension to CEP/extensions.",
    (y) => y,
    () => {
      symlinkCommand();
    }
  )
  .command(
    "$0",
    "Create Project",
    (yargs) =>
      yargs
        .positional("appName", { type: "string", default: "" })
        .option("use-npm", { type: "boolean", default: false }),
    ({ appName, useNpm }) => {
      createCommand({ appName, useNpm });
    }
  )
  .help()
  .parse();

// console.log(argv);

// const program = new Command(packageJson.name)
//   .version(packageJson.version)
//   .arguments("<project-directory>")
//   .usage(`${chalk.green`a`}`)
//   .action((name, {}) => {
//     appName = name.trim();
//     createCommand({ appNAme });
//   })
//   .option("--use-npm")
//   .parse(process.argv);
