import { generate } from "../src/index.ts";
import { test } from "node:test";
import { assertSchema } from "./util.ts";

test("Empty array handling", () => {
    const out = generate([]);
    assertSchema(out, {
        type: "array"
    });
});

test("Single type array handling", () => {
    const out = generate([1, 2, 3]);
    assertSchema(out, {
        type: "array",
        items: {
            type: "integer"
        }
    });
});

test("Multi-type array handling", () => {
    const out = generate([
        1,
        "abc",
        {
            alpha: "beta",
            charlie: null
        }
    ]);
    assertSchema(out, {
        type: "array",
        items: {
            anyOf: [
                {
                    type: "integer"
                },
                {
                    type: "string"
                },
                {
                    type: "object",
                    properties: {
                        alpha: {
                            type: "string"
                        },
                        charlie: {
                            type: "null"
                        }
                    }
                }
            ]
        }
    });
});
