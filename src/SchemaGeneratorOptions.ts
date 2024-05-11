import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { Stack } from "./Stack.ts";

export type SchemaGeneratorMiddleware = (
    value: unknown,
    stack: Stack,
    run: (value: unknown, stack: Stack) => JSONSchema7
) => JSONSchema7;

export type SchemaGeneratorOptions = {
    requireAll?: boolean;
    inferStringFormat?: boolean;
    convertInts?: boolean;
    coerceSymbolsToStrings?: boolean;
    coerceFunctionsToObjects?: boolean;
    additionalProperties?: JSONSchema7Definition;
    middleware?: SchemaGeneratorMiddleware;
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
