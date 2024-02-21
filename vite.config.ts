import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import babel from '@rollup/plugin-babel'

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
              extensions: ['.js', '.ts'],
              // babelHelpers: false,
              // plugins: ['@babel/plugin-transform-runtime'],
              presets: [
                  [
                      '@babel/preset-env',
                      {
                          useBuiltIns: false,
                          corejs: false,
                          targets: {
                              browsers: ['ie > 9'],
                          },
                      },
                  ],
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
