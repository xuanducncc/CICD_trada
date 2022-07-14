const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const DotenvPlugin = require("dotenv-webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const gitRevisionPlugin = new GitRevisionPlugin();

const PACKAGE = require("./package.json");

module.exports = (env, argv) => ({
  mode: argv.mode,
  target: "web",
  devtool: argv.mode === "development" ? "source-map" : false,
  entry: {
    vendor: ["react", "react-dom", "prop-types"],
    bundle: ["babel-polyfill", "./src/index"],
  },
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "./src/app"),
      "@core": path.resolve(__dirname, "./src/core"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@libs": path.resolve(__dirname, "./src/libs/"),
      "@assets": path.resolve(__dirname, "./src/assets/"),
    },
  },
  devServer: {
    stats: "minimal",
    overlay: true,
    historyApiFallback: true,
    disableHostCheck: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    https: false,
    historyApiFallback: true,
    proxy: [
      {
        context: ["/api"],
        changeOrigin: true,
        logLevel: "debug",
        cookieDomainRewrite: "localhost",
        target: env.proxy,
        "secure" : false,
        onProxyReq: (proxyReq) => {
          // Browers may send Origin headers even with same-origin
          // requests. To prevent CORS issues, we have to change
          // the Origin to match the target URL.
          if (proxyReq.getHeader("origin")) {
            proxyReq.setHeader("origin", proxyReq.getHeader("origin"));
          }
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "../static"),
    publicPath: "/",
    filename: "[name].[contenthash].js",
  },
  plugins: [
    new DotenvPlugin({
      path: `.env.${env.platform}`, // load this now instead of the ones in '.env'
      safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
      systemvars: false, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: false, // hide any errors
      defaults: false, // load '.env.defaults' as the default values if empty.
    }),
    gitRevisionPlugin,
    new webpack.DefinePlugin({
      // This global makes sure React is built in prod mode.
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.API_URL": JSON.stringify(process.env.API_URL),
      "process.env.PACKAGE_VERSION": JSON.stringify(PACKAGE.version),
      "process.env.BUILD_VERSION": JSON.stringify(gitRevisionPlugin.version()),
      "process.env.BUILD_COMMIT": JSON.stringify(
        gitRevisionPlugin.commithash()
      ),
      "process.env.BUILD_BRANCH": JSON.stringify(gitRevisionPlugin.branch()),
      "process.env.BUILD_DATE": JSON.stringify(Date.now()),
    }),
    new HtmlWebpackPlugin({
      template: "src/index.html",
      favicon: "./src/favicon.ico",
      minify:
        argv.mode == "development"
          ? false
          : {
              // see https://github.com/kangax/html-minifier#options-quick-reference
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
    }),
  ].concat(
    argv.mode == "production"
      ? [
          new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
          }),
          new CleanWebpackPlugin(),
        ]
      : []
  ),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [
                [
                  "import",
                  { libraryName: "antd", libraryDirectory: "es", style: "css" },
                ],
              ],
            },
          },
          "eslint-loader",
        ],
      },
      {
        test: /(\.css)$/,
        use:
          argv.mode == "production"
            ? [
                MiniCssExtractPlugin.loader,
                {
                  loader: "css-loader",
                  options: {
                    sourceMap: false,
                  },
                },
                {
                  loader: "postcss-loader",
                  options: {
                    plugins: () => [require("cssnano")],
                    sourceMap: false,
                  },
                },
              ]
            : ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  node: { fs: "empty", net: "empty" },
  target: "web", // Make web variables accessible to webpack, e.g. window
});
