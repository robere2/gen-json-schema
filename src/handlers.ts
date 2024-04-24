import { CompleteHandler } from "./handlers/GenericHandler";
import { BigIntHandler } from "./handlers/impl/BigIntHandler";
import { ArrayHandler } from "./handlers/impl/ArrayHandler";
import { BooleanHandler } from "./handlers/impl/BooleanHandler";
import { FunctionHandler } from "./handlers/impl/FunctionHandler";
import { NumberHandler } from "./handlers/impl/NumberHandler";
import { ObjectHandler } from "./handlers/impl/ObjectHandler";
import { SymbolHandler } from "./handlers/impl/SymbolHandler";
import { StringHandler } from "./handlers/impl/StringHandler";
import { UndefinedHandler } from "./handlers/impl/UndefinedHandler";

export const handle: CompleteHandler<never> = (options, value, stack, handle) => {
    return options.middleware(value, stack, (value, stack) => {
        return handle[typeof value](options, value, stack, handle);
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
