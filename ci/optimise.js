import { jsFileMap } from "./fileops.js";
import { minify } from "terser";

export async function optimise(inputPath, distPath) {
    await jsFileMap(inputPath, distPath, minify, (x) => x.code, {
        compress: {
            passes: 5
        },
        sourceMap: false,
        mangle: true,
        format: {
            comments: false
        }
    });
}