import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { ValueAccessor } from "./util.ts";

export class Stack {
    private readonly stack: (keyof never)[];

    public constructor(stack: (keyof never)[] = []) {
        this.stack = [...stack];
    }

    public static fromString(str: string): Stack {
        // Split at non-escaped forward slashes
        let elements = str.split(/(?<!\\)\//g);
        // Un-escape backslashes
        elements = elements.map((e) => e.replaceAll("\\\\", "\\"));
        // Un-escape forward slashes
        elements = elements.map((e) => e.replaceAll("\\/", "/"));
        return new Stack(elements);
    }

    public push(...element: (keyof never)[]): Stack {
        const copy = this.copy();
        copy.stack.push(...element);
        return copy;
    }

    public getAccessor<T>(object: unknown): ValueAccessor<T> {
        if (this.depth === 0) {
            throw new Error("Cannot get accessor on an object using an empty stack");
        }
        const key = this.stack[this.stack.length - 1];
        const parent = this.pop().accessOn(object) as { [key: string | number | symbol]: T };
        if ((typeof parent !== "object" && typeof parent !== "function") || parent === null) {
            throw new Error(`Cannot access property ${key.toString()} on ${parent}`);
        }
        return {
            get() {
                return parent[key];
            },
            set(value) {
                parent[key] = value;
            }
        };
    }

    public accessOn(object: unknown, strict: boolean = true): unknown {
        const accessing = [...this.stack];
        let prevValue: unknown = undefined;
        let currentValue: unknown = object;
        while (accessing.length > 0) {
            const next = accessing.shift()!;
            if (typeof currentValue !== "object" || currentValue === null) {
                if (strict) {
                    if (Array.isArray(prevValue)) {
                        throw new Error(`Cannot access index ${next.toString()} on ${prevValue}`);
                    } else {
                        throw new Error(
                            `Cannot access property ${next.toString()} on ${prevValue}`
                        );
                    }
                }
                return undefined;
            }
            prevValue = currentValue;
            currentValue = (currentValue as never)[next];
        }
        return currentValue;
    }

    private attemptConvertSchemaCompositions(schema: JSONSchema7): Stack {
        // Order matters - this is the order of precedence when multiple compositions may match
        const compositionKeywords: ("anyOf" | "oneOf" | "allOf")[] = ["anyOf", "oneOf", "allOf"];

        for (const compositionKeyword of compositionKeywords) {
            const schemaCompositionEntry = schema[compositionKeyword];
            if (!schemaCompositionEntry) {
                continue;
            }

            for (let i = 0; i < schemaCompositionEntry.length; i++) {
                const subschema = schemaCompositionEntry[i];
                try {
                    const subSchemaStack = this.convertForSchema(subschema);
                    return new Stack([compositionKeyword, i, ...subSchemaStack.elements]);
                } catch (ignored) {
                    /* empty */
                }
            }
        }

        throw new Error(`No matching schema found in the schema composition(s)`);
    }

    public convertForSchema(schema: JSONSchema7Definition): Stack {
        if (this.depth === 0) {
            return this.copy();
        }

        const next = this.elements[0];
        // noinspection SuspiciousTypeOfGuard (not sure why...)
        if (typeof next === "symbol") {
            throw new Error(`Schemas cannot contain Symbols (Remaining stack: ${this.toString()})`);
        }

        if (typeof schema === "boolean") {
            throw new Error(
                `Cannot access property "${next.toString()}" on schema (boolean value, remaining stack: ${this.toString()})`
            );
        }

        try {
            return this.attemptConvertSchemaCompositions(schema);
        } catch (ignored) {
            /* empty */
        }

        if (schema.type !== "array" && schema.type !== "object") {
            throw new Error(
                `Cannot access property "${next.toString()}" on schema (type is not "array" or "object", remaining stack: ${this.toString()})`
            );
        }

        if (schema.type === "array") {
            if (typeof next !== "number") {
                throw new Error(
                    `Attempting to access non-numerical index on an array in schema (Remaining stack: ${this.toString()}`
                );
            }

            if (schema.items && typeof schema.items !== "boolean") {
                // Tuple array schema ("prefixItems" in draft 2020-12). Validate only against the index
                if (Array.isArray(schema.items)) {
                    const item = schema.items[next];
                    try {
                        const subSchemaStack = this.shift().convertForSchema(item);
                        return new Stack(["items", next, ...subSchemaStack.elements]);
                    } catch (ignored) {
                        /* empty */
                    }
                } else {
                    try {
                        const subSchemaStack = this.shift().convertForSchema(schema.items);
                        return new Stack(["items", ...subSchemaStack.elements]);
                    } catch (ignored) {
                        /* empty */
                    }
                }
            }

            if (schema.additionalItems && typeof schema.additionalItems !== "boolean") {
                try {
                    const subSchemaStack = this.shift().convertForSchema(schema.additionalItems);
                    return new Stack(["additionalItems", ...subSchemaStack.elements]);
                } catch (ignored) {
                    /* empty */
                }
            }
        } else {
            // schema.type === "object"
            if (schema.properties && schema.properties[next]) {
                try {
                    const subSchemaStack = this.shift().convertForSchema(schema.properties[next]);
                    return new Stack(["properties", next, ...subSchemaStack.elements]);
                } catch (ignored) {
                    /* empty */
                }
            }

            if (schema.patternProperties && typeof next === "string") {
                for (const pattern in schema.patternProperties) {
                    const regex = new RegExp(pattern);
                    if (regex.test(next)) {
                        try {
                            const subSchemaStack = this.shift().convertForSchema(
                                schema.patternProperties[pattern]
                            );
                            return new Stack([
                                "patternProperties",
                                pattern,
                                ...subSchemaStack.elements
                            ]);
                        } catch (ignored) {
                            /* empty */
                        }
                    }
                }
            }

            if (schema.additionalProperties && typeof schema.additionalProperties !== "boolean") {
                try {
                    const subSchemaStack = this.shift().convertForSchema(
                        schema.additionalProperties
                    );
                    return new Stack(["additionalProperties", ...subSchemaStack.elements]);
                } catch (ignored) {
                    /* empty */
                }
            }
        }

        throw new Error(
            `Cannot access property "${next.toString()}" on schema (Remaining stack: ${this.toString()})`
        );
    }

    public shift(): Stack {
        const copy = this.copy();
        if (copy.stack.length === 0) {
            throw new Error("Cannot shift off empty stack");
        }
        copy.stack.shift();
        return copy;
    }

    public pop(): Stack {
        const copy = this.copy();
        if (copy.stack.length === 0) {
            throw new Error("Cannot pop off empty stack");
        }
        copy.stack.pop();
        return copy;
    }

    public get depth(): number {
        return this.stack.length;
    }

    public get elements(): (keyof never)[] {
        return [...this.stack];
    }

    public copy(): Stack {
        return new Stack(this.stack);
    }

    public toString(): string {
        const stringifiedStack = this.stack.map((v) => {
            if (typeof v === "string") {
                return v.replaceAll("\\", "\\\\").replaceAll("/", "\\/");
            }
            return v.toString();
        });
        return stringifiedStack.join("/");
    }
}
