import { GenericHandler } from "../GenericHandler";

export const BooleanHandler: GenericHandler<boolean> = () => {
    return {
        type: "boolean"
    };
};
