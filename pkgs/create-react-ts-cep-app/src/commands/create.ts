import chalk from "chalk";
import cpy from "cpy";
import path from "path";
import { spawn } from "child_process";
import { writeFileSync, existsSync, readFileSync } from "fs";
import validateProjectName from "validate-npm-package-name";
import prompts from "prompts";

// ncc breaks '*.json' string with __nccwpck_require__
const THE_JSON = [..."json"].join("");

export function createCommand({
  appName,
  useNpm,
}: {
  appName: string;
  useNpm: boolean;
}) {
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
          `  ${chalk.cyan("create-react-ts-manifest-app")} ${chalk.green(
            "<project-directory>"
          )}`
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

    const appPath = path.posix.join(process.cwd(), appName);

    if (existsSync(appPath)) {
      console.log();
      console.log(chalk.red(`Project directory \`${appName}\` already exists`));
      console.log(
        chalk.red("Please remove it or specify another project-directory")
      );
      console.log();

      process.exit(1);
    }

    console.log("Copying files... to ", appPath);
    await cpy(["./**/*"], appPath, {
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
      const appPackageJsonPath = path.posix.join(
        appPath,
        `package.${THE_JSON}`
      );
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
      const manifestPath = path.posix.join(appPath, "manifest.config.ts");
      const manifest = readFileSync(manifestPath, { encoding: "utf-8" });
      writeFileSync(
        manifestPath,
        manifest
          .replace(/{{extensionId}}/g, extensionId)
          .replace(/{{appName}}/g, appName),
        { encoding: "utf-8" }
      );
    }

    {
      const debugPath = path.posix.join(appPath, ".debug");
      const dotDebug = readFileSync(debugPath, { encoding: "utf-8" });
      writeFileSync(
        debugPath,
        dotDebug.replace(/{{extensionId}}/g, extensionId),
        { encoding: "utf-8" }
      );
    }

    {
      const packageCommands: [string, string[]][] = useNpm
        ? [["npm", ["install"]]]
        : [["yarn", ["install"]]];

      for (let command of packageCommands) {
        await new Promise<void>((resolve, reject) => {
          const [proc, args] = command;

          spawn(proc, args, {
            stdio: "inherit",
            cwd: appPath,
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

    console.log(`${chalk.green("Success!")} Created ${appName} at ${appPath}`);
  }

  run().catch((e) => {
    console.log();
    console.log(chalk.red("Installation failed: "), e);
    console.log();
  });
}
