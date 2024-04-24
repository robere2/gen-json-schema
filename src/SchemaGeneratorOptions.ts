import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { StackEntry } from "./StackEntry";

export type SchemaGeneratorOptions = {
    requireAll?: boolean;
    inferStringFormat?: boolean;
    convertInts?: boolean;
    coerceSymbolsToStrings?: boolean;
    coerceFunctionsToObjects?: boolean;
    additionalProperties?: JSONSchema7Definition;
    middleware?: (
        value: never,
        stack: StackEntry[],
        run: (value: never, stack: StackEntry[]) => JSONSchema7
    ) => JSONSchema7;
};

export const defaultSchemaGeneratorOptions: SchemaGeneratorOptions = {
    requireAll: false,
    inferStringFormat: false,
    convertInts: true,
    coerceSymbolsToStrings: true,
    coerceFunctionsToObjects: true,
    additionalProperties: true,
    middleware: (value, stack, run) => run(value, stack)
};
