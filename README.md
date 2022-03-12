# create-react-ts-cep-app

Create Adobe CEF extension with React/TypeScript

## Get started

```
npx @hanakla/create-react-ts-cep-app <extension-name-here>
```

and

```
yarn install
yarn start
```

## Default stacks

- TypeScript
- React / styled-components
- Webpack / Parcel
  - Webpack for frontend (for babel-plugin-styled-components)
  - Parcel for host (for ES3 environment bundling)

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
