import { JSONSchema7 } from "json-schema";
import assert from "node:assert";

export function assertSchema(actual: JSONSchema7, expected: JSONSchema7): void {
    assert.deepStrictEqual(actual, expected);
}
