import { build } from "esbuild";

export async function buildAndMinify(entryPath, distPath) {
    await build({
    entryPoints: [entryPath],
    bundle: true,
    splitting: true,
    minify: true,
    format: "esm",
    outdir: distPath,
});
}