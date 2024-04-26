import * as fs from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const initScript = `import { generate } from "../src/index.ts";

console.log(generate({
    "Hello": "World!"
}))
`;

const playgroundPath = join(__dirname, "playground.ts");

fs.writeFileSync(playgroundPath, initScript);

console.log(`\x1b[32mCreated basic playground script at ${playgroundPath}`);
console.log(`\x1b[32mRun "npm run playground" to run it.`);
console.log("\x1b[0m");
