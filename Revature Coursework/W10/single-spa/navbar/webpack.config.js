const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "revature",
    projectName: "navbar",
    webpackConfigEnv,
    argv,
    outputSystemJS: true,
  });

  return merge(defaultConfig, {
    devServer: {
      port: 8081,
    },
    // Externalize React - use shared version from import map
    externals: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "single-spa-react",
    ],
    output: {
      publicPath: webpackConfigEnv.production
        ? "http://2304-sspa-navbar-cli.s3-website-us-west-1.amazonaws.com/"
        : "http://localhost:8081/",
    }
  });
};
