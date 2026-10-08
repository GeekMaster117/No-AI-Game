import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export async function fileMap(inputPath, distPath, endsWithFilter, func = (x) => x, extract = (x) => x, ...params) {
    const entries = await readdir(inputPath, {
        recursive: true,
        withFileTypes: true
    });
    const jsFiles = entries.filter(entry =>
        entry.name.endsWith(endsWithFilter)
    );

    for (const file of jsFiles) {
        const sourcePath = join(file.parentPath, file.name);
        const source = await readFile(sourcePath, "utf8");

        const output = await func(source, ...params)

        const outputParentPath = join(distPath, file.parentPath.slice(inputPath.length + 1));
        await mkdir(outputParentPath, { recursive: true });

        const outputPath = join(distPath, sourcePath.slice(inputPath.length + 1));
        await writeFile(outputPath, extract(output));
    }
}