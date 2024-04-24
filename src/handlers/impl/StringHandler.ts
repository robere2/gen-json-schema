import { JSONSchema7 } from "json-schema";
import { GenericHandler } from "../GenericHandler";

export const StringHandler: GenericHandler<string> = () => {
    const output: JSONSchema7 = {
        type: "string"
    };

    // TODO option inferStringFormat

    return output;
};
