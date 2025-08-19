import { parseArgs } from "node:util";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { build } from "vite";

(async () => {
  const { isDevelopment } = getArgs();

  // Build for CEP client script
  build({
    root: "src/client",
    base: "./",
    plugins: [react({}), tailwindcss()],
    build: {
      outDir: "../../dist/client",
      watch: isDevelopment
        ? {
            include: ["../**/*"],
          }
        : null,
      rollupOptions: {
        input: {
          index: "src/client/index.html",
        },
      },
    },
    server: isDevelopment ? {} : undefined,
  });

  // build for host script
  build({
    plugins: [
      react({
        devTarget: "es3",
      }),
    ],
    build: {
      minify: !isDevelopment,
      outDir: "dist/host",
      emptyOutDir: true,
      lib: {
        name: "host",
        entry: "src/host/index.ts",
        formats: ["iife"],
        fileName: () => "index.js",
      },
      sourcemap: isDevelopment,
      watch: isDevelopment
        ? {
            include: ["src/**/*"],
          }
        : null,
    },
  });
})();

function getArgs() {
  const args = parseArgs({
    options: {
      mode: {
        type: "string",
        default: "development",
        short: "m",
        alias: "mode",
      },
    },
    args: process.argv.slice(2),
  });

  const isDevelopment =
    args.values.mode === "development" ||
    process.env.NODE_ENV === "development";

  return { isDevelopment };
}
