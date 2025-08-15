// eslint.config.js
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  // Other configs (e.g., language-specific, framework-specific)
  eslintPluginPrettierRecommended, // Enables eslint-plugin-prettier and eslint-config-prettier
  {
    ignores: [
      "dist/",
      "node_modules/",
      "build/",
      "coverage/",
      "out/",
      "src-tauri/target/",
    ],
  },
];
