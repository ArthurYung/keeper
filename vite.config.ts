import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import babel from "@rollup/plugin-babel";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es", "cjs"],
      fileName: "index",
    },
    rollupOptions: {
      plugins: [
        babel({
          extensions: [".js", ".ts"],
          // babelHelpers: "runtime",
          // plugins: ["@babel/plugin-transform-runtime"],
          presets: [
            ["@babel/preset-env", { targets: ["ie > 9"] }],
            "@babel/preset-typescript",
          ],
        }),
      ],
    },
  },
  plugins: [
    dts({
      exclude: ["**/__tests__", "**/*.test.ts"],
      rollupTypes: true,
      // tsconfig: 'build.tsconfig.json'
    }),
  ],
  test: {
    coverage: {
      exclude: ["src/type.ts", "src/index.ts"],
    },
  },
});
