import { SchemaGeneratorOptions } from "../SchemaGeneratorOptions.ts";
import { JSONSchema7 } from "json-schema";
import { AllTypeofs } from "../util.ts";
import { Stack } from "../Stack.ts";

export interface GenericHandler<T> {
    (
        options: Required<SchemaGeneratorOptions>,
        value: T,
        stack: Stack,
        handle: CompleteHandler<unknown>
    ): JSONSchema7;
}

export interface CompleteHandler<T>
    extends GenericHandler<T>,
        Record<AllTypeofs | "array", GenericHandler<never>> {
    array: GenericHandler<unknown[]>;
    bigint: GenericHandler<bigint>;
    boolean: GenericHandler<boolean>;
    // eslint-disable-next-line @typescript-eslint/ban-types
    function: GenericHandler<Function>;
    number: GenericHandler<number>;
    object: GenericHandler<object>;
    string: GenericHandler<string>;
    symbol: GenericHandler<symbol>;
    undefined: GenericHandler<undefined>;
}