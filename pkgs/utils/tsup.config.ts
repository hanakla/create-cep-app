import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  target: "es3",
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
});
