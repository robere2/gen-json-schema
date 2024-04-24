import { test } from "node:test";
import { Stack } from "../src/index.ts";
import assert from "node:assert";

test("Stack.push()", () => {
    let stack = new Stack();
    assert.strictEqual(stack.depth, 0);
    stack = stack.push("123");
    assert.strictEqual(stack.depth, 1);
});

test("Stack.pop()", () => {
    let stack = new Stack();
    stack = stack.push("123");
    stack = stack.pop();
    assert.strictEqual(stack.depth, 0);
    assert.throws(() => {
        stack.pop();
    });
});

test("Stacks are immutable", () => {
    const stack = new Stack();
    const newStack = stack.push("a");
    assert.strictEqual(stack.depth, 0);

    newStack.pop();
    assert.strictEqual(newStack.depth, 1);
});

test("Pre-existing stack", () => {
    const elems = ["abc", "123", "xyz"];
    const stack = new Stack(elems);
    assert.strictEqual(stack.depth, 3);

    elems.push("blah");
    assert.strictEqual(stack.depth, 3);
});

test("Stack.depth", () => {
    let stack = new Stack();
    assert.strictEqual(stack.depth, 0);
    stack = stack.push("abcd");
    assert.strictEqual(stack.depth, 1);
    stack = stack.push("abcd");
    assert.strictEqual(stack.depth, 2);
    stack = stack.push("1234");
    assert.strictEqual(stack.depth, 3);
});

test("Stack.toString()", () => {
    let stack = new Stack();
    assert.strictEqual(stack.toString(), "");
    stack = stack.push("abcd");
    assert.strictEqual(stack.toString(), "abcd");
    stack = stack.push("abcd");
    assert.strictEqual(stack.toString(), "abcd/abcd");
    stack = stack.push("1234");
    assert.strictEqual(stack.toString(), "abcd/abcd/1234");
});

test("Stack.elements", () => {
    const stack = new Stack(["abc", "123", "xyz"]);
    const elements = stack.elements;

    assert.strictEqual(elements.length, 3);
    assert.strictEqual(stack.depth, 3);
    elements.push("blah");
    assert.strictEqual(elements.length, 4);
    assert.strictEqual(stack.depth, 3);
});

test("Stack.copy()", () => {
    const stack = new Stack(["abc", "123", "xyz"]);
    const stackCopy = stack.copy();
    assert.notStrictEqual(stack, stackCopy);
    assert.notStrictEqual(stack.elements, stackCopy.elements);
    assert.deepStrictEqual(stack.elements, stackCopy.elements);
    assert.strictEqual(stack.depth, stackCopy.depth);
});

test("Stack elements with non-alphanumeric characters", () => {
    const stack = new Stack([
        "Element One",
        "Test/With/Slash",
        "Test\\With\\Backslash",
        "Test.With.Periods"
    ]);

    assert.strictEqual(
        stack.toString(),
        "Element One/Test\\/With\\/Slash/Test\\\\With\\\\Backslash/Test.With.Periods"
    );
});

test("Stack.fromString()", () => {
    const stack = Stack.fromString("abc/123/456");
    assert.strictEqual(stack.depth, 3);
    assert.strictEqual(stack.elements[0], "abc");
    assert.strictEqual(stack.elements[1], "123");
    assert.strictEqual(stack.elements[2], "456");
});

test("Stack.fromString() with non-alphanumeric characters", () => {
    const stack = Stack.fromString(
        "Element One/Test\\/With\\/Slash/Test\\\\With\\\\Backslash/Test.With.Periods"
    );
    assert.strictEqual(stack.depth, 4);
    assert.strictEqual(stack.elements[0], "Element One");
    assert.strictEqual(stack.elements[1], "Test/With/Slash");
    assert.strictEqual(stack.elements[2], "Test\\With\\Backslash");
    assert.strictEqual(stack.elements[3], "Test.With.Periods");
});
