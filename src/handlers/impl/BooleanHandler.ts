import { GenericHandler } from "../GenericHandler.ts";

export const BooleanHandler: GenericHandler<boolean> = () => {
    return {
        type: "boolean"
    };
};
