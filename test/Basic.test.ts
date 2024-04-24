import { generate } from "../src/index.ts";
import { test } from "node:test";
// @ts-ignore -- issue with rootDir which doesn't matter since we're using ts-node.
import { assertSchema } from "./util.ts";

test("String handling", () => {
    let out = generate("Hello, world!");
    assertSchema(out, {
        type: "string"
    });

    out = generate("");
    assertSchema(out, {
        type: "string"
    });
});

test("BigInt handling", () => {
    let out = generate(BigInt(`${Number.MAX_SAFE_INTEGER}0`));
    assertSchema(out, {
        type: "integer"
    });

    out = generate(BigInt(`-${Number.MAX_SAFE_INTEGER}0`));
    assertSchema(out, {
        type: "integer"
    });

    out = generate(BigInt(27));
    assertSchema(out, {
        type: "integer"
    });
});

test("Boolean handling", () => {
    let out = generate(true);
    assertSchema(out, {
        type: "boolean"
    });

    out = generate(false);
    assertSchema(out, {
        type: "boolean"
    });
});

test("Number handling", () => {
    let out = generate(43);
    assertSchema(out, {
        type: "integer"
    });

    out = generate(43.0);
    assertSchema(out, {
        type: "integer"
    });

    out = generate(-43.0);
    assertSchema(out, {
        type: "integer"
    });

    out = generate(43.1);
    assertSchema(out, {
        type: "number"
    });

    out = generate(43, { convertInts: false });
    assertSchema(out, {
        type: "number"
    });
});

test("Undefined handling", () => {
    const out = generate(undefined);
    assertSchema(out, {});
});
