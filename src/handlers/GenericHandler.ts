import { SchemaGeneratorOptions } from "../SchemaGeneratorOptions";
import { StackEntry } from "../StackEntry";
import { JSONSchema7 } from "json-schema";
import { AllTypeofs } from "../util";

export interface GenericHandler<T> {
    (
        options: Required<SchemaGeneratorOptions>,
        value: T,
        stack: StackEntry[],
        handle: CompleteHandler<never>
    ): JSONSchema7;
}

export interface CompleteHandler<T>
    extends GenericHandler<T>,
        Record<AllTypeofs | "array", GenericHandler<never>> {
    array: GenericHandler<never[]>;
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
