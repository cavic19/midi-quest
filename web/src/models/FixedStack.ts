/**
 * Stack of fixed size. If more items are added the oldest items are dropped.
 */
class FixedStack<T> {
    private array: T[] = [];

    constructor(
        public readonly size: number
    ) { }

    push(item: T) {
        this.array = [...this.array.slice(1 - this.size), item];
    }

    includes(item: T): boolean {
        return this.array.includes(item);
    }

    entries(): T[] {
        return [...this.array];
    }

    clear() {
        this.array = [];
    }
}

export default FixedStack;