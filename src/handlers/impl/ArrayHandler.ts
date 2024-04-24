import { GenericHandler } from "../GenericHandler.ts";

export const ArrayHandler: GenericHandler<unknown[]> = () => {
    return {
        type: "array"
    };
};
