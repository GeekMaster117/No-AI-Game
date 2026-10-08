import { fileMap } from './fileops.js';

export async function buildIndexHTML(indexEntryPath, distPath) {
    await fileMap(indexEntryPath, distPath, ".html");
}