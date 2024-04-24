import { GenericHandler } from "../GenericHandler.ts";

/**
 * JSON schema draft 7 does not support any sort of "bigint" format. We just
 * need to treat this as a normal integer.
 */
export const BigIntHandler: GenericHandler<bigint> = () => {
    return {
        type: "integer"
    };
};
