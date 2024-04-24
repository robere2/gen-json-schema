import { generate } from "../src/index.ts";
import { test } from "node:test";
import assert from "node:assert";
import { JSONSchema7 } from "json-schema";
import { assertSchema } from "./util.ts";

test("Symbol coercion handling", () => {
    let out = generate(Symbol("Hi there"));
    assertSchema(out, {
        type: "string"
    });

    out = generate(Symbol());
    assertSchema(out, {
        type: "string"
    });

    assert.throws(() => {
        out = generate(Symbol("Hi there"), { coerceSymbolsToStrings: false });
    });

    assert.throws(() => {
        out = generate(Symbol(), { coerceSymbolsToStrings: false });
    });
});
test("Function coercion handling", () => {
    function fnNoProps() {}
    function fnWithProps() {}
    const lambdaNoProps = () => {};
    const lambdaWithProps = () => {};

    fnWithProps.abc = "123";
    lambdaWithProps.abc = "123";
    fnWithProps.xyz = 456;
    lambdaWithProps.xyz = 456;

    const withPropsOutput: JSONSchema7 = {
        type: "object",
        properties: {
            abc: {
                type: "string"
            },
            xyz: {
                type: "integer"
            }
        }
    };

    let out = generate(fnWithProps);
    assertSchema(out, withPropsOutput);

    out = generate(lambdaWithProps);
    assertSchema(out, withPropsOutput);

    out = generate(fnNoProps);
    assertSchema(out, { type: "object" });

    out = generate(lambdaNoProps);
    assertSchema(out, { type: "object" });

    assert.throws(() => {
        out = generate(fnWithProps, { coerceFunctionsToObjects: false });
    });
    assert.throws(() => {
        out = generate(fnNoProps, { coerceFunctionsToObjects: false });
    });
    assert.throws(() => {
        out = generate(lambdaWithProps, { coerceFunctionsToObjects: false });
    });
    assert.throws(() => {
        out = generate(lambdaNoProps, { coerceFunctionsToObjects: false });
    });

    // Call the functions so they're represented as 100% in the code coverage... Node test runner
    // currently has no way of excluding our test files from our coverage report
    fnNoProps();
    fnWithProps();
    lambdaWithProps();
    lambdaNoProps();
});
