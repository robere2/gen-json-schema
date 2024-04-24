import { generate } from "../src/index.ts";
import { test } from "node:test";
import { assertSchema } from "./util.ts";

test("Basic object handling", () => {
    const out = generate({
        propOne: "This is a string",
        propTwo: 4238,
        propThree: true,
        propFour: Symbol(),
        propFive: undefined,
        propSix: 100000n,
        propSeven: 4238.5,
        propEight: null
    });
    assertSchema(out, {
        type: "object",
        properties: {
            propOne: { type: "string" },
            propTwo: { type: "integer" },
            propThree: { type: "boolean" },
            propFour: { type: "string" },
            propFive: {},
            propSix: { type: "integer" },
            propSeven: { type: "number" },
            propEight: { type: "null" }
        }
    });
});

test("Deep object handling", () => {
    const out = generate({
        propOne: {
            propTwo: {
                propThree: {
                    propFour: "hi",
                    propSix: null
                }
            },
            propFive: 17
        }
    });
    assertSchema(out, {
        type: "object",
        properties: {
            propOne: {
                type: "object",
                properties: {
                    propTwo: {
                        type: "object",
                        properties: {
                            propThree: {
                                type: "object",
                                properties: {
                                    propFour: {
                                        type: "string"
                                    },
                                    propSix: {
                                        type: "null"
                                    }
                                }
                            }
                        }
                    },
                    propFive: {
                        type: "integer"
                    }
                }
            }
        }
    });
});

test("Empty object handling", () => {
    const out = generate({});
    assertSchema(out, {
        type: "object"
    });
});

test("Additional Properties option", () => {
    let out = generate(
        {},
        {
            additionalProperties: false
        }
    );
    assertSchema(out, {
        type: "object",
        additionalProperties: false
    });

    out = generate(
        { abc: 123.5 },
        {
            additionalProperties: {
                type: "string"
            }
        }
    );
    assertSchema(out, {
        type: "object",
        properties: {
            abc: {
                type: "number"
            }
        },
        additionalProperties: {
            type: "string"
        }
    });
});
