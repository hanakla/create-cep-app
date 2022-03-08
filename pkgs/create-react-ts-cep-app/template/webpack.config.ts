import { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";

export default (): Configuration => {
  return {
    mode: "development",

    context: path.join(__dirname, "client"),
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
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
            },
          ],
        },
        {
          test: /\.(png|gif|jpe?g)/,
          loader: "file-loader",
        },
        {
          test: /\.css/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },

    externals: ["fs"],

    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: path.resolve(__dirname, "client/index.html"),
      }),
    ],
  };
};
