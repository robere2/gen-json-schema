export class Stack {
    private readonly stack: (keyof never)[];

    public constructor(stack: (keyof never)[] = []) {
        this.stack = [...stack];
    }

    public static fromString(str: string): Stack {
        // Split at non-escaped forward slashes
        let elements = str.split(/(?<!\\)\//g);
        // Un-escape backslashes
        elements = elements.map((e) => e.replaceAll("\\\\", "\\"));
        // Un-escape forward slashes
        elements = elements.map((e) => e.replaceAll("\\/", "/"));
        return new Stack(elements);
    }

    public push(element: keyof never): Stack {
        const copy = this.copy();
        copy.stack.push(element);
        return copy;
    }

    public accessOn(object: unknown, strict: boolean = true): unknown {
        const accessing = [...this.stack].reverse();
        let currentValue: unknown = object;
        while (accessing.length > 0) {
            const next = accessing.pop()!;
            if (typeof currentValue !== "object" || currentValue === null) {
                if (strict) {
                    if (Array.isArray(currentValue)) {
                        throw new Error(
                            `Cannot access index ${next.toString()} on ${currentValue}`
                        );
                    } else {
                        throw new Error(
                            `Cannot access property ${next.toString()} on ${currentValue}`
                        );
                    }
                }
                return undefined;
            }
            currentValue = (currentValue as never)[next];
        }
        return currentValue;
    }

    public pop(): Stack {
        const copy = this.copy();
        if (copy.stack.length === 0) {
            throw new Error("Cannot pop off empty stack");
        }
        copy.stack.pop();
        return copy;
    }

    public get depth(): number {
        return this.stack.length;
    }

    public get elements(): (keyof never)[] {
        return [...this.stack];
    }

    public copy(): Stack {
        return new Stack(this.stack);
    }

    public toString(): string {
        const stringifiedStack = this.stack.map((v) => {
            if (typeof v === "string") {
                return v.replaceAll("\\", "\\\\").replaceAll("/", "\\/");
            }
            return v.toString();
        });
        return stringifiedStack.join("/");
    }
}
