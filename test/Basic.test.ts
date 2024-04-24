import { generate } from "../src/index.ts";
import { test } from "node:test";
import assert from "node:assert";

test("String handling", () => {
    let out = generate("Hello, world!");
    assert.deepStrictEqual(out, {
        type: "string"
    });

    out = generate("");
    assert.deepStrictEqual(out, {
        type: "string"
    });
});

test("BigInt handling", () => {
    let out = generate(BigInt(`${Number.MAX_SAFE_INTEGER}0`));
    assert.deepStrictEqual(out, {
        type: "integer"
    });

    out = generate(BigInt(`-${Number.MAX_SAFE_INTEGER}0`));
    assert.deepStrictEqual(out, {
        type: "integer"
    });

    out = generate(BigInt(27));
    assert.deepStrictEqual(out, {
        type: "integer"
    });
});

test("Boolean handling", () => {
    let out = generate(true);
    assert.deepStrictEqual(out, {
        type: "boolean"
    });

    out = generate(false);
    assert.deepStrictEqual(out, {
        type: "boolean"
    });
});

test("Number handling", () => {
    let out = generate(43);
    assert.deepStrictEqual(out, {
        type: "integer"
    });

    out = generate(43.0);
    assert.deepStrictEqual(out, {
        type: "integer"
    });

    out = generate(-43.0);
    assert.deepStrictEqual(out, {
        type: "integer"
    });

    out = generate(43.1);
    assert.deepStrictEqual(out, {
        type: "number"
    });
});

test("Undefined handling", () => {
    const out = generate(undefined);
    assert.deepStrictEqual(out, {});
});
