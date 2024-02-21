import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es", "cjs"],
      fileName: "index",
    },
  },
  plugins: [
    dts({
      exclude: ["**/__tests__", "**/*.test.ts"],
      rollupTypes: true,
    }),
  ],
});
