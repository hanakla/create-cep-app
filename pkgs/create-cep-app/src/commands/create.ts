import chalk from "chalk";
import cpy from "cpy";
import path from "path";
import { spawn } from "child_process";
import { writeFileSync, existsSync, readFileSync, renameSync } from "fs";
import validateProjectName from "validate-npm-package-name";
import prompts from "prompts";

export function createCommand({
  appName,
  extensionId,
  useNpm,
}: {
  appName: string | null | undefined;
  extensionId: string | null | undefined;
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

    if (!extensionId) {
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

    {
      console.log("Copying files... to ", appPath);
      await cpy(["./**/*"], appPath, {
        dot: true,
        markDirectories: true,
        ignore: ["./yarn.lock", ...(useNpm ? [".yarnrc.yml"] : [])],
        ignoreFiles: ["gitignore", "npmignore"],
        cwd: path.posix.join(__dirname, "../../template"),
        rename: (name) => {
          if (name === "gitignore") return ".gitignore";
          if (name === "npmignore") return ".npmignore";
          if (name === "dot-debug") return ".debug";
          if (name === "dot-keep") return ".keep";
          return name;
        },
      });
      renameSync(
        path.posix.join(appPath, "vscode"),
        path.posix.join(appPath, ".vscode")
      );
    }

    {
      const appPackageJsonPath = path.posix.join(appPath, "package.json");
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
      let extId = extensionId;
      const templateFiles = [
        path.posix.join(appPath, "manifest.config.ts"),
        path.posix.join(appPath, ".debug"),
      ];

      templateFiles.forEach((path) => {
        const manifest = readFileSync(path, { encoding: "utf-8" });
        writeFileSync(
          path,
          manifest
            .replace(/{{extensionId}}/g, extId)
            .replace(/{{appName}}/g, appName!),
          { encoding: "utf-8" }
        );
      });
    }

    console.log("✅ App template files copied");

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
              console.error(chalk.red(`😱 Failed to install dependencies`));
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
