import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    production &&
      terser({
        format: {
          comments: false,
        },
      }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
