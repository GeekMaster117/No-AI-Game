import { fileMap } from "./fileops.js";
import { minify } from "terser";

export async function optimise(inputPath, distPath) {
    await fileMap(inputPath, distPath, ".js", minify, (x) => x.code, {
        compress: {
            passes: 5,            // Run optimization loops multiple times to catch deep optimizations
            unsafe: true,         // Enable unsafe transformations (e.g., rewriting objects/expressions)
            unsafe_arrows: true,  // Convert ES5 functions to arrow functions where possible
            unsafe_comps: true,   // Optimize comparisons (e.g., changing order or operators)
            unsafe_math: true,    // Optimize numerical expressions (e.g., evaluates constant expressions)
            unsafe_methods: true, // Convert `{ a: function(){} }` to `{ a(){} }`
            unsafe_proto: true,   // Optimize `Array.prototype.slice.call(...)` into `[].slice.call(...)`
            unsafe_regexp: true,  // Enable substitute variables with regular expressions
            pure_getters: true,   // Assume object property access doesn't have side effects
            top_retain: null,     // Don't protect any specific top-level symbols
            toplevel: true,       // Drop unreferenced functions and variables in top-level scope
            drop_console: true,   // Remove console.* statements entirely
            drop_debugger: true,  // Remove debugger statements
            dead_code: true,      // Remove unreachable code
            evaluate: true,       // Evaluate constant expressions
            inline: 3,            // Maximize function inlining (0-3 scale, 3 is most aggressive)
            reduce_funcs: true,   // Inline single-use functions
            reduce_vars: true,    // Inline single-use variables
            switches: true,       // De-duplicate and optimize switch-case blocks
            typeofs: true,        // Optimize typeof expressions
        },
        mangle: {
            toplevel: true,       // Mangle variable and function names in the top-level scope
        },
        ecma: 2020,             // Output modern JS syntax (modern syntax minifies smaller than ES5)
        module: true,           // Tell Terser the input is an ES module (allows better dead-code elimination)
    });
}