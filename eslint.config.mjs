import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: ["dist/", "out/", "node_modules/"],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            // Match existing code style: allow namespaces (used for Deploy and Oc modules)
            "@typescript-eslint/no-namespace": "off",
        },
    },
);
