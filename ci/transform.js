import { jsFileMap } from "./fileops.js";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

export async function transform(inputPath, distPath) {
    await jsFileMap(inputPath, distPath, removeValidations);
}

function removeValidations(source) {
    const ast = parse(source, {
        sourceType: "module"
    });

    traverse(ast, {
        ExpressionStatement(path) {
            const expr = path.node.expression;

            // Is it a function call?
            if (!t.isCallExpression(expr)) {
                return;
            }

            // Is it Type.xxx(...) or Range.xxx(...)?
            if (!t.isMemberExpression(expr.callee)) {
                return;
            }

            const object = expr.callee.object;

            if (!t.isIdentifier(object)) {
                return;
            }

            const removeObjects = new Set([
                "TypeCheck",
                "RangeCheck"
            ]);

            if (!removeObjects.has(object.name)) {
                return;
            }

            path.remove();
        }
    });

    return generate(ast).code;
}