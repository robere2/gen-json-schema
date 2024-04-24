import { JSONSchema7 } from "json-schema";
import { GenericHandler } from "../GenericHandler";

export const NumberHandler: GenericHandler<number> = (options, value) => {
    const output: JSONSchema7 = {
        type: "number"
    };
    if (options.convertInts && Number.isInteger(value)) {
        output.type = "integer";
    }

    return output;
};
