import { JSONSchema7 } from "json-schema";
import { defaultSchemaGeneratorOptions, SchemaGeneratorOptions } from "./SchemaGeneratorOptions";
import { handle } from "./handlers";

function isValidOption(optionName: string): optionName is keyof SchemaGeneratorOptions {
    return Object.hasOwn(defaultSchemaGeneratorOptions, optionName);
}

function generate<T extends never>(options: SchemaGeneratorOptions = {}, value: T): JSONSchema7 {
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
    const requiredOptions = (options = {
        ...defaultSchemaGeneratorOptions,
        ...options
    } as Required<SchemaGeneratorOptions>);

    return handle(requiredOptions, value, [], handle);
}

export { generate, SchemaGeneratorOptions };
