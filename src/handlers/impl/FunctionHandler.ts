import { GenericHandler } from "../GenericHandler.ts";

// eslint-disable-next-line @typescript-eslint/ban-types
export const FunctionHandler: GenericHandler<Function> = (options, value, stack, handle) => {
    if (!options.coerceFunctionsToObjects) {
        throw new Error(`Encountered Function ${value.name} when function-to-object
            coercion is disabled. See option "coerceFunctionsToObjects" for more information.`);
    }
    return handle.object(options, value, stack, handle);
};
