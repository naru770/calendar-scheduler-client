import { defineConfig, loadEnv } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig(() => {
  return {
    plugins: [pluginReact()],
    html: {
      template: "public/index.html",
    },
    output: {
      distPath: {
        root: "build",
      },
    },
  };
});
