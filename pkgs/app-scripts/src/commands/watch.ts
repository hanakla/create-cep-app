import path from "path";
import chalk from "chalk";
import { assertProjectRoot } from "../utils/assertProjectRoot";

const webpack: typeof import("webpack") = require(require.resolve("webpack", {
  paths: [process.cwd()],
}));

export const watchCommand = async () => {
  assertProjectRoot();

  const config = require(path.posix.join(
    process.cwd(),
    "webpack.config"
  )).default;
  const compiler = webpack({ ...config, watch: true });

  compiler.hooks.beforeCompile.tap("cep-ap-scripts", () => {
    console.log("running");
  });

  compiler.hooks.done.tap({ name: "cep-app-scripts" }, (opt) => {
    if (!opt.hasErrors) {
      console.log(chalk.green`Client scripts compiled`);
    } else {
      console.error(chalk.red`Client scripts compilation error`);
      console.error(opt.compilation.errors.map((e) => e.message));
    }
  });

  compiler.run(() => {});
};
