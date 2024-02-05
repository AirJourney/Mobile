import { defineConfig ,loadEnv} from "vite";
import react from "@vitejs/plugin-react";
import vitePluginImp from "vite-plugin-imp";
import path from "path";

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env": env,
    },
    plugins: [
      react(),
      vitePluginImp({
        libList: [
          {
            libName: "@nutui/nutui-react",
            style: (name) => {
              return `@nutui/nutui-react/dist/esm/${name}/style/css`;
            },
            replaceOldImport: false,
            camel2DashComponentName: false,
          }
        ]
      })
    ],
    resolve:{
      alias:{
        "@static": path.resolve(__dirname, "src/static"),
        "@components": path.resolve(__dirname, "src/components"),
        "@pages": path.resolve(__dirname, "src/pages"),
        "@constant": path.resolve(__dirname, "src/constant"),
        "@router": path.resolve(__dirname, "src/router"),
        "@services": path.resolve(__dirname, "src/services"),
        "@utils": path.resolve(__dirname, "src/utils"),
        "@state": path.resolve(__dirname, "src/state"),
      }
    }
	
  };
});