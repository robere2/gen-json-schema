import { test } from "node:test";
import { generate, Stack } from "../src/index.ts";
import assert from "node:assert";
import { assertSchema } from "./util.ts";

test("Calls middleware for each object property", () => {
    const stackEntries: Map<Stack, unknown> = new Map();
    generate(
        {
            propOne: "abc",
            propTwo: {
                propThree: 123
            }
        },
        {
            middleware: (value, stack, run) => {
                stackEntries.set(stack, value);
                return run(value, stack);
            }
        }
    );

    assert.strictEqual(stackEntries.size, 4);
    const keys = Array.from(stackEntries.keys()).map((stack) => stack.toString());
    assert.strictEqual(keys.includes(""), true);
    assert.strictEqual(keys.includes("propOne"), true);
    assert.strictEqual(keys.includes("propTwo"), true);
    assert.strictEqual(keys.includes("propTwo/propThree"), true);
});

test("Middleware allows for modifying values in objects", () => {
    const out = generate(
        {
            propOne: "abc",
            propTwo: {
                propThree: 123
            }
        },
        {
            middleware: (value, stack, run) => {
                if (stack.toString() === "propTwo/propThree") {
                    return {
                        const: 500
                    };
                }
                return run(value, stack);
            }
        }
    );

    assertSchema(out, {
        type: "object",
        properties: {
            propOne: {
                type: "string"
            },
            propTwo: {
                type: "object",
                properties: {
                    propThree: {
                        const: 500
                    }
                }
            }
        }
    });
});
