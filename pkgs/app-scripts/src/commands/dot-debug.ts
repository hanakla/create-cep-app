import chalk from "chalk";
import { writeFileSync } from "fs";
import path from "path";
import mkdirp from "mkdirp";
import { buildManifest } from "../index";
import { assertProjectRoot } from "../utils/assertProjectRoot";
import { buildDotDebug } from "../cepConfig/debugConfig";

export const manifestCommand = async () => {
  assertProjectRoot();

  const configPath = path.posix.join(process.cwd(), "manifest.config.ts");
  const dist = path.posix.join(process.cwd(), ".debug");

  const config = require(configPath).debugPorts;
  if (!config) {
    console.log(
      `[manifest.config.ts].debugPorts not found, to ignoring this command`
    );
    return;
  }

  const dotDebug = buildDotDebug(config);

  await mkdirp(path.posix.join(process.cwd(), "CSXS"));
  writeFileSync(dist, dotDebug, {
    encoding: "utf-8",
  });

  console.log(
    chalk.green
      .bold`Manifest created to CSXS/manifest.xml by manifest.config.ts`
  );
};
