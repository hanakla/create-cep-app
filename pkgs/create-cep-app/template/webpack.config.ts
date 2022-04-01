import webpack, { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ForkTSCheckerPlugin from "fork-ts-checker-webpack-plugin";
import path from "path";

export default (): Configuration => {
  return {
    mode: "development",

    // CEP is nwjs, but styled-components doesn't work if target to nwjs
    target: "electron-renderer",
    devtool: false,
    context: path.join(__dirname, "src/client"),
    entry: { client: "./index.tsx" },

    output: {
      path: path.resolve(__dirname, "dist/client"),
    },

    resolve: {
      extensions: [".js", ".ts", ".tsx"],
    },

    module: {
      rules: [
        {
          test: /\.[tj]sx?/,
          exclude: /node_modules(?!\/csinterface)/,
          use: [
            {
              loader: "babel-loader",
            },
          ],
        },
        {
          test: /\.(png|gif|jpe?g)$/,
          loader: "file-loader",
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },

    externals: ["fs"],

    plugins: [
      new webpack.SourceMapDevToolPlugin({
        exclude: /node_modules\/@spectrum-web-components\/icons/,
      }),
      new ForkTSCheckerPlugin({
        typescript: { configFile: path.join(__dirname, "tsconfig.json") },
      }),
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: path.resolve(__dirname, "src/client/index.html"),
      }),
    ],
  };
};
