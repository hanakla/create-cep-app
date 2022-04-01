import { defineCEPManifest } from "@hanakla/cep-app-scripts";

export default defineCEPManifest({
  bundleId: "{{extensionId}}",
  locales: "All",
  requiredRuntime: { CSXS: "5.0" },
  hostApps: {
    illustrator: { version: "[18.0,99.9]" },
    // photoshop: { version: "[18.0,99.9]" },
  },
  extensions: [
    {
      id: "{{extensionId}}",
      version: require("./package.json").version,
      mainPath: "./dist/client/index.html",
      cefCommandLine: ["--enable-nodejs", "--mixed-context"],
      scriptPath: "./dist/host/index.js",
      lifeCycle: {
        autoVisible: true,
      },
      ui: {
        type: "Panel",
        menu: "{{appName}}",
        geometry: {
          size: {
            width: 300,
            height: 300,
          },
        },
      },
    },
  ],
});
