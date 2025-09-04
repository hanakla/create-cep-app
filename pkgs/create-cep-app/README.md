# @hanakla/create-cep-app

Create Awesome Adobe CEF extension with React/TypeScript.

## Table of contents

- [Get started](#get-started)
- [Default technology stacks](#default-technology-stacks)
- [Configuaring `manifest.xml`](#configuaring-manifest-xml)
- [Development references](#development-references)

## Get started

```
npx @hanakla/create-cep-app <extension-name-here>
```

and

```
yarn install
yarn start
```

## Default technology stacks

- TypeScript
- React / Tailwind v4 / Spectrum Web Components
- Vite

## Configuaring `manifest.xml`

`CSXS/manifest.xml` genereted via `manifest.config.ts` of top on app.
See example below.

```tsx
import { createCEPConfig } from "@hanakla/create-react-ts-cep-app";

export default createCEPConfig({
  bundleId: "com.<your-bundle-id>",
  locales: "All",
  requiredRuntime: { CSXS: "5.0" },
  hostApps: {
    illustrator: { version: "[18.0,99.9]" },
    // photoshop: { version: "[18.0,99.9]" },
  },
  extensions: [
    {
      id: "com.<your-extension-id>",
      version: require("./package.json").version,
      mainPath: "./dist/client/index.html",
      cefCommandLine: [],
      scriptPath: "./dist/host/hostscript.js",
      lifeCycle: {
        autoVisible: true,
      },
      ui: {
        type: "Panel",
        menu: "Extension",
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
```

## Development references

- [Adobe-CEP/CEP-Resources](https://github.com/Adobe-CEP/CEP-Resources)
- [Adobe Extensibility API Docs](https://docsforadobe.dev/)
- [Illustrator AIHostAdapter プラグイン | Just Diary](https://kawano-shuji.com/justdiary/2022/02/21/illustrator-aihostadapter-plugin/)
