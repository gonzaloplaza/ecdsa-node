import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import * as path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills({ globals: { Buffer: true } })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
