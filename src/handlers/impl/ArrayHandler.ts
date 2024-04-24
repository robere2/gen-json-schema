import { GenericHandler } from "../GenericHandler";

export const ArrayHandler: GenericHandler<never[]> = () => {
    return {
        type: "array"
    };
};
