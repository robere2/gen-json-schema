import { JSONSchema7 } from "json-schema";
import { StackEntry } from "../../StackEntry";
import { GenericHandler } from "../GenericHandler";

export const ObjectHandler: GenericHandler<object> = (options, value, stack, handle) => {
    if (Array.isArray(value)) {
        return handle.array(options, value as never, stack, handle);
    }
    if (value === null) {
        return {
            type: "null"
        };
    }
    const output: JSONSchema7 = {
        type: "object"
    };

    if (options.additionalProperties !== true) {
        output.additionalProperties = options.additionalProperties;
    }

    if (Object.keys(value).length === 0) {
        return output;
    }
    output.properties = {};

    for (const prop in value) {
        output.properties[prop] = handle(
            options,
            (value as never)[prop],
            [...stack, new StackEntry(prop)],
            handle
        );
    }

    return output;
};
