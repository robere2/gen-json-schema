import { GenericHandler } from "../GenericHandler";

export const SymbolHandler: GenericHandler<symbol> = (options, value, stack, handle) => {
    if (!options.coerceSymbolsToStrings) {
        throw new Error(`Encountered Symbol ${value.toString()} when symbol-to-string
            coercion is disabled. See option "coerceSymbolsToStrings" for more information.`);
    }

    return handle.string(options, value.description ?? "", stack, handle);
};
