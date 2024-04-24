import { JSONSchema7 } from "json-schema";
import { defaultSchemaGeneratorOptions, SchemaGeneratorOptions } from "./SchemaGeneratorOptions.ts";
import { handle } from "./handlers.ts";

function isValidOption(optionName: string): optionName is keyof SchemaGeneratorOptions {
    return Object.hasOwn(defaultSchemaGeneratorOptions, optionName);
}

function generate<T>(value: T, options: SchemaGeneratorOptions = {}): JSONSchema7 {
    // Validate all options, and delete any which are specifically passed as undefined. We will
    // overwrite them with the default.
    for (const prop in options) {
        if (!isValidOption(prop)) {
            throw new Error(`Unknown option "${prop}" passed to generate function.`);
        }

        if (options[prop] === undefined) {
            delete options[prop];
        }
    }

    // This cast is safe because we deleted all explicitly provided undefined values and then
    // spread in the default values.
    const requiredOptions = {
        ...defaultSchemaGeneratorOptions,
        ...options
    } as Required<SchemaGeneratorOptions>;

    return handle(requiredOptions, value, [], handle);
}

export { generate, SchemaGeneratorOptions };
