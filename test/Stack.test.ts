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
    stack = stack.push("456");
    stack = stack.pop();
    assert.strictEqual(stack.depth, 1);
    assert.strictEqual(stack.toString(), "123");
    stack = stack.pop();
    assert.throws(() => {
        stack.pop();
    });
});

test("Stack.shift()", () => {
    let stack = new Stack();
    stack = stack.push("123");
    stack = stack.push("456");
    stack = stack.shift();
    assert.strictEqual(stack.depth, 1);
    assert.strictEqual(stack.toString(), "456");
    stack = stack.shift();
    assert.strictEqual(stack.depth, 0);
    assert.throws(() => {
        stack.shift();
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

test("Stacks with number elements", () => {
    let stack = new Stack([4, 11]);
    assert.strictEqual(stack.depth, 2);
    assert.strictEqual(stack.elements[0], 4);
    assert.strictEqual(stack.elements[1], 11);
    assert.strictEqual(stack.toString(), "4/11");

    // Stack can also contain strings, and numbers can be pushed
    stack = stack.push("hello");
    stack = stack.push(7);
    assert.strictEqual(stack.depth, 4);
    assert.strictEqual(stack.elements[0], 4);
    assert.strictEqual(stack.elements[1], 11);
    assert.strictEqual(stack.elements[2], "hello");
    assert.strictEqual(stack.elements[3], 7);
    assert.strictEqual(stack.toString(), "4/11/hello/7");

    // fromString() does not parse numbers
    stack = Stack.fromString(stack.toString());
    assert.strictEqual(stack.depth, 4);
    assert.strictEqual(stack.elements[0], "4");
    assert.strictEqual(stack.elements[1], "11");
    assert.strictEqual(stack.elements[2], "hello");
    assert.strictEqual(stack.elements[3], "7");
    assert.strictEqual(stack.toString(), "4/11/hello/7");

    // Elements can be non-integers
    stack = stack.push(3.14159);
    assert.strictEqual(stack.depth, 5);
    assert.strictEqual(stack.elements[0], "4");
    assert.strictEqual(stack.elements[1], "11");
    assert.strictEqual(stack.elements[2], "hello");
    assert.strictEqual(stack.elements[3], "7");
    assert.strictEqual(stack.elements[4], 3.14159);
    assert.strictEqual(stack.toString(), "4/11/hello/7/3.14159");
});

test("Stacks with symbol elements", () => {
    const symbolArr = [Symbol(), Symbol("hello")];
    let stack = new Stack(symbolArr);
    assert.strictEqual(stack.depth, 2);
    assert.strictEqual(stack.elements[0], symbolArr[0]);
    assert.strictEqual(stack.elements[1], symbolArr[1]);
    assert.notStrictEqual(stack.elements[0], Symbol());
    assert.notStrictEqual(stack.elements[1], Symbol("hello"));
    assert.strictEqual(stack.toString(), "Symbol()/Symbol(hello)");

    // Stack can also contain strings and numbers and symbols can be pushed
    stack = stack.push("hello");
    stack = stack.push(7);
    symbolArr[2] = Symbol("hello");
    stack = stack.push(symbolArr[2]);
    assert.strictEqual(stack.depth, 5);
    assert.strictEqual(stack.elements[0], symbolArr[0]);
    assert.strictEqual(stack.elements[1], symbolArr[1]);
    assert.strictEqual(stack.elements[2], "hello");
    assert.strictEqual(stack.elements[3], 7);
    assert.strictEqual(stack.elements[4], symbolArr[2]);
    assert.notStrictEqual(stack.elements[1], stack.elements[2]);
    assert.notStrictEqual(stack.elements[1], stack.elements[4]);
    assert.strictEqual(stack.toString(), "Symbol()/Symbol(hello)/hello/7/Symbol(hello)");

    // fromString() does not parse symbols
    stack = Stack.fromString(stack.toString());
    assert.strictEqual(stack.depth, 5);
    assert.strictEqual(stack.elements[0], "Symbol()");
    assert.strictEqual(stack.elements[1], "Symbol(hello)");
    assert.strictEqual(stack.elements[2], "hello");
    assert.strictEqual(stack.elements[3], "7");
    assert.strictEqual(stack.elements[4], "Symbol(hello)");
    assert.strictEqual(stack.toString(), "Symbol()/Symbol(hello)/hello/7/Symbol(hello)");
});

test("Stack.accessOn() Simple Objects", () => {
    let stack = new Stack([]);
    const obj: any = {};
    assert.strictEqual(stack.accessOn(obj), obj);

    stack = new Stack(["abc"]);
    obj.abc = 123;
    assert.strictEqual(stack.accessOn(obj), obj.abc);
    assert.strictEqual(stack.accessOn(obj), 123);

    stack = new Stack(["xyz", 456]);
    obj.xyz = {
        456: "Elephant!"
    };
    assert.strictEqual(stack.accessOn(obj), obj.xyz[456]);
    assert.strictEqual(stack.accessOn(obj), "Elephant!");
});

test("Stack.accessOn() Arrays & Symbols", () => {
    let stack = new Stack(["arr", 2]);
    const obj: any = {
        arr: ["hi", "hello", "waddup"]
    };
    assert.strictEqual(stack.accessOn(obj), obj.arr[2]);
    assert.strictEqual(stack.accessOn(obj), "waddup");

    const sym = Symbol("My Symbol");
    stack = new Stack(["xyz", sym]);
    obj.xyz = {
        [sym]: "Milk"
    };
    assert.strictEqual(stack.accessOn(obj), obj.xyz[sym]);
    assert.strictEqual(stack.accessOn(obj), "Milk");
});

test("Stack.accessOn() Recursive Object", () => {
    const stack = new Stack(["a", "b", "a", "b", "a"]);
    const a: any = {};
    const b: any = {};

    a.b = b;
    b.a = a;

    assert.strictEqual(stack.accessOn(b), a);
});

test("Stack.accessOn() Strict undefined", () => {
    const stack = new Stack(["a", "b", "c"]);
    const obj = {
        a: {
            b: {}
        }
    };

    assert.strictEqual(stack.accessOn(obj), undefined);
});

test("Stack.accessOn() Strict Undefined Fail", () => {
    const stack = new Stack(["a"]);

    assert.throws(() => {
        stack.accessOn(undefined);
    });
});

test("Stack.accessOn() Strict Object Fail", () => {
    const stack = new Stack(["a", "b", "c", "d"]);
    const obj = {
        a: {
            b: {
                foo: "bar"
            }
        }
    };

    assert.throws(() => {
        stack.accessOn(obj);
    });
});

test("Stack.accessOn() Non-strict Object Fail", () => {
    const stack = new Stack(["a", "b", "c", "d"]);
    const obj = {
        a: {
            b: {
                foo: "bar"
            }
        }
    };

    assert.strictEqual(stack.accessOn(obj, false), undefined);
});

test("Stack.accessOn() Strict Array Fail", () => {
    const stack = new Stack(["a", "b", 1, "d"]);
    const obj = {
        a: {
            b: [
                {
                    d: "index 1 doesnt exist"
                }
            ]
        }
    };

    assert.throws(() => {
        stack.accessOn(obj);
    });
});

test("Stack.accessOn() Non-strict Array Fail", () => {
    const stack = new Stack(["a", "b", 1, "d"]);
    const obj = {
        a: {
            b: [
                {
                    d: "index 1 doesnt exist"
                }
            ]
        }
    };

    assert.strictEqual(stack.accessOn(obj, false), undefined);
});
