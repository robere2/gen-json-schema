// A generator needs to exist for all values that can be returned by typeof.
// https://stackoverflow.com/questions/69654873/can-i-define-a-typescript-type-as-all-possible-resulting-values-from-typeof
import assert from "node:assert";

const unused = typeof (1 as never);
export type AllTypeofs = typeof unused;

export type ValueAccessor<G, S = G> = {
    get: () => G;
    set: (value: S) => void;
};

export function deepEqual(a: unknown, b: unknown): boolean {
    try {
        assert.deepStrictEqual(a, b);
    } catch {
        return false;
    }
    return true;
}
