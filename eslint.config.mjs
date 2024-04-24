import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
    { ignores: ["dist/", ".husky/", ".idea/", "node_modules/"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    eslintConfigPrettier,
    {
        files: ["test/**/*"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off"
        }
    }
];
