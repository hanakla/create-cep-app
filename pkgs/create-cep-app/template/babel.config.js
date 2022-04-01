module.exports = {
  presets: [
    ["@babel/preset-env", { loose: true, useBuiltIns: "usage" }],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
  plugins: ["babel-plugin-styled-components"],
};
