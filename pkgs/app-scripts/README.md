# @hanakla/cep-app-scripts

Building scripts for [`@hanakla/create-cep-app`](https://github.com/hanakla/create-cep-app).

## Commands

### `manifest`

Build `CSXS/manifest.xml` by `manifest.config.ts`

```
cep-app-scripts manifest
```

### `symlink`

Create symlink or junction to your CEP extensions folder from current app.

```
cep-app-scripts manifest
```

### `pack`

Zipping your app for distribute extension.  
It copying `./CSXS`, `./dist`, `./icons` and `./package.json` into `tmp/package` and create `releases/{name}-{version}.zip`

```
cep-app-scripts pack
```

## TODO

- [ ] ZXP signing
