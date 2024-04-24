import { generate } from "../src/index.ts";
import { test } from "node:test";
import assert from "node:assert";
import { assertSchema } from "./util.ts";

test("Only known options are allowed", () => {
    assert.throws(() => {
        generate({}, {
            somethingNotValid: true
        } as any);
    });
});

// Whitebox test
test("Undefined options are set to default", () => {
    // Values which are explicitly provided as undefined should be reset back to their default
    // value. We're testing two here: middleware's default value is a function which just calls
    // its run argument immediately. Without it, the program will crash (cannot access
    // undefined). convertInts says to parse integer numbers into an integer type instead of
    // number type. undefined is falsey, so we'd expect this to fail in current implementation
    // if the option isn't reset.
    const out = generate(123, {
        convertInts: undefined,
        middleware: undefined
    });

    assertSchema(out, { type: "integer" });
});
