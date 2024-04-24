import { CompleteHandler } from "./handlers/GenericHandler.ts";
import { BigIntHandler } from "./handlers/impl/BigIntHandler.ts";
import { ArrayHandler } from "./handlers/impl/ArrayHandler.ts";
import { BooleanHandler } from "./handlers/impl/BooleanHandler.ts";
import { FunctionHandler } from "./handlers/impl/FunctionHandler.ts";
import { NumberHandler } from "./handlers/impl/NumberHandler.ts";
import { ObjectHandler } from "./handlers/impl/ObjectHandler.ts";
import { SymbolHandler } from "./handlers/impl/SymbolHandler.ts";
import { StringHandler } from "./handlers/impl/StringHandler.ts";
import { UndefinedHandler } from "./handlers/impl/UndefinedHandler.ts";

export const handle: CompleteHandler<unknown> = (options, value, stack, handle) => {
    return options.middleware(value, stack, (value, stack) => {
        return handle[typeof value](options, value as never, stack, handle);
    });
};
handle.array = ArrayHandler;
handle.bigint = BigIntHandler;
handle.boolean = BooleanHandler;
handle.function = FunctionHandler;
handle.number = NumberHandler;
handle.object = ObjectHandler;
handle.string = StringHandler;
handle.symbol = SymbolHandler;
handle.undefined = UndefinedHandler;
