export class Stack {
    private readonly stack: string[];

    public constructor(stack: string[] = []) {
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

    public push(element: string): Stack {
        const copy = this.copy();
        copy.stack.push(element);
        return copy;
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

    public get elements(): string[] {
        return [...this.stack];
    }

    public copy(): Stack {
        return new Stack(this.stack);
    }

    public toString(): string {
        const stringifiedStack = this.stack.map((str) => {
            return str.replaceAll("\\", "\\\\").replaceAll("/", "\\/");
        });
        return stringifiedStack.join("/");
    }
}
