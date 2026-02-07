import * as Path from "node:path";

const rootDir = "./dist/";
export function resolvePath(...path: string[]) {
    return Path.resolve(rootDir, ...path);
}
