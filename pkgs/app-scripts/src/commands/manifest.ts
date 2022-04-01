import chalk from "chalk";
import { writeFileSync } from "fs";
import path from "path";
import mkdirp from "mkdirp";
import { buildManifest } from "../index";
import { assertProjectRoot } from "../utils/assertProjectRoot";

export const manifestCommand = async () => {
  assertProjectRoot();

  const configPath = path.posix.join(process.cwd(), "manifest.config.ts");
  const dist = path.posix.join(process.cwd(), "CSXS/manifest.xml");

  const config = require(configPath).default;
  const manifest = buildManifest(config);

  await mkdirp(path.posix.join(process.cwd(), "CSXS"));
  writeFileSync(dist, manifest, {
    encoding: "utf-8",
  });

  console.log(
    chalk.green
      .bold`Manifest created to CSXS/manifest.xml by manifest.config.ts`
  );
};
