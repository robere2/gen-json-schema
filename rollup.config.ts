import { dts } from "rollup-plugin-dts";
import typescript from "@rollup/plugin-typescript";

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/index.cjs",
                format: "cjs"
            },
            {
                file: "dist/index.mjs",
                format: "esm"
            }
        ],
        plugins: [typescript()]
    },
    {
        input: "dist/dts/index.d.ts",
        output: {
            file: "dist/index.d.ts"
        },
        plugins: [dts()]
    }
];
