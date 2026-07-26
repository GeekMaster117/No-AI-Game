import { transform } from "./ci/transform.js";
import { resolve } from "node:path";
import { buildAndMinify } from "./ci/build.js";
import { optimise } from "./ci/optimise.js";

await transform(resolve('src'), resolve('dist', 'transform'))

await buildAndMinify(resolve('dist', 'transform', 'game.js'), resolve('dist', 'build'));

await optimise(resolve('dist', 'build'), resolve('dist'))