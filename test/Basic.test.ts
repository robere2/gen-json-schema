import { generate } from "../src/index.ts";
import { test } from "node:test";
import assert from "node:assert";

test("String handling", () => {
    const out = generate("Hello, world!");
    assert.deepStrictEqual(out, {
        type: "string"
    });
});
