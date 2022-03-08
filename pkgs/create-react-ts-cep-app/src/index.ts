#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import cpy from "cpy";
import path from "path";
import { spawn } from "child_process";
import { writeFileSync, existsSync, readFileSync } from "fs";
import validateProjectName from "validate-npm-package-name";
import prompts from "prompts";

// ncc breaks '*.json' string with __nccwpck_require__
const THE_JSON = [..."json"].join("");

const packageJson = require(`../package.${THE_JSON}`);
let appName: string = "";

const program = new Command(packageJson.name)
  .version(packageJson.version)
  .arguments("<project-directory>")
  .usage(`${chalk.green`a`}`)
  .action((name) => {
    appName = name.trim();
  })
  .option("--use-npm")
  .parse(process.argv);

const printValidationResults = (errors: string[] = []) => {
  errors.forEach((error) => console.log(`  ${chalk.red(error)}`));
};

async function run() {
  // Validate package name
  {
    if (!appName) {
      appName = (
        await prompts({
          type: "text",
          name: "appName",
          message: "Enter new app name",
        })
      ).appName;
    }

    if (!appName) {
      console.log();
      console.log(`${chalk.red("Please specify the project directory:")}`);
      console.log(
        `  ${chalk.cyan(program.name())} ${chalk.green("<project-directory>")}`
      );
      console.log();

      process.exit(1);
    }

    const validation = validateProjectName(appName);
    if (!validation.validForNewPackages) {
      console.log(validation);
      console.log();
      console.log(chalk.red(`Invalid project name: \`${appName}\``));
      printValidationResults(validation.errors);
      printValidationResults(validation.warnings);
      console.log();

      process.exit(1);
    }
  }

  let extensionId: string;
  {
    extensionId = (
      await prompts({
        type: "text",
        name: "id",
        message: "Enter extension id (likes com.example.your-extension)",
        validate: (id) => id !== "",
      })
    ).id;

    if (!extensionId) {
      console.log(chalk.red(`Invalid extension id: \`${appName}\``));
      process.exit(1);
    }
  }

  const appoPath = path.posix.join(process.cwd(), appName);

  if (existsSync(appoPath)) {
    console.log();
    console.log(chalk.red(`Project directory \`${appName}\` already exists`));
    console.log(
      chalk.red("Please remove it or specify another project-directory")
    );
    console.log();

    process.exit(1);
  }

  console.log("Copying files... to ", appoPath);
  await cpy(["./**/*"], appoPath, {
    dot: true,
    markDirectories: true,
    ignore: ["./yarn.lock"],
    ignoreFiles: ["gitignore", "npmignore"],
    cwd: path.posix.join(__dirname, "../template"),
    rename: (name) => {
      if (name === "gitignore") return ".gitignore";
      if (name === "npmignore") return ".npmignore";
      if (name === "dot-debug") return ".debug";
      return name;
    },
  });

  {
    const appPackageJsonPath = path.posix.join(appoPath, `package.${THE_JSON}`);
    const appPackageJson = JSON.parse(
      readFileSync(appPackageJsonPath, { encoding: "utf-8" })
    );
    appPackageJson.name = appName;
    writeFileSync(
      appPackageJsonPath,
      JSON.stringify(appPackageJson, null, "  "),
      {
        encoding: "utf-8",
      }
    );
  }

  {
    const manifestPath = path.posix.join(appoPath, "CSXS/manifest.xml");
    const manifest = readFileSync(manifestPath, { encoding: "utf-8" });
    writeFileSync(
      manifestPath,
      manifest.replace(/{{extensionId}}/g, extensionId),
      { encoding: "utf-8" }
    );
  }

  {
    const debugPath = path.posix.join(appoPath, ".debug");
    const dotDebug = readFileSync(debugPath, { encoding: "utf-8" });
    writeFileSync(
      debugPath,
      dotDebug.replace(/{{extensionId}}/g, extensionId),
      { encoding: "utf-8" }
    );
  }

  {
    const packageCommands: [string, string[]][] = program.opts().useNpm
      ? [["npm", ["install"]]]
      : [["yarn", ["install"]]];

    for (let command of packageCommands) {
      await new Promise<void>((resolve, reject) => {
        const [proc, args] = command;

        spawn(proc, args, {
          stdio: "inherit",
          cwd: appoPath,
          env: { ...process.env },
        }).on("close", (code) => {
          if (code !== 0) {
            reject(new Error("`yarn install` failed"));
            return;
          }

          resolve();
        });
      });
    }
  }

  console.log(`${chalk.green("Success!")} Created ${appName} at ${appoPath}`);
}

run().catch((e) => {
  console.log();
  console.log(chalk.red("Installation failed: "), e);
  console.log();
});
