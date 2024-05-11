import { GenericHandler } from "../GenericHandler.ts";
import { JSONSchema7 } from "json-schema";
import { deepEqual } from "../../util.ts";

export const ArrayHandler: GenericHandler<unknown[]> = (options, value, stack, handle) => {
    const output: JSONSchema7 = {
        type: "array"
    };

    const itemSchemas: JSONSchema7[] = [];
    valuesLoop: for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const itemSchema = handle(options, item, stack.push(i), handle);
        for (const existing of itemSchemas) {
            if (deepEqual(itemSchema, existing)) {
                continue valuesLoop;
            }
        }
        itemSchemas.push(itemSchema);
    }

    if (itemSchemas.length === 1) {
        output.items = itemSchemas[0];
    } else if (itemSchemas.length > 1) {
        output.items = {
            anyOf: itemSchemas
        };
    }

    return output;
};
