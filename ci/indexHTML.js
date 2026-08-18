import { writeFile } from 'node:fs/promises'
import { basename, dirname } from 'node:path';

function generateIndexHTML(jsEntryPath) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Document</title>
    </head>
    <body>
        <script src="${jsEntryPath}" type="module"></script>
    </body>
    </html>`
}

export async function buildIndexHTML(jsEntryPath) {
    const indexHTML = generateIndexHTML(basename(jsEntryPath));
    await writeFile(`${dirname(jsEntryPath)}/index.html`, indexHTML);
}