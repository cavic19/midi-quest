import FixedStack from "./FixedStack";
import KeyboardShape from "./KeyboardShape";

abstract class KeyboardShapeGenerator<TShape extends KeyboardShape = KeyboardShape> {
    // Something like memory, so we don't generate same notes one after the other
    private stack = new FixedStack<TShape>(3);

    abstract generateRandom(): TShape

    next(): TShape {
        let random: TShape;
        do {
            random = this.generateRandom();
            // If the random shape has recenly been generated, generate new random
        } while (this.stack.entries().some(recentShape => recentShape.equalTo(random)))
        this.stack.push(random);
        return random;
    }

    previous(): TShape {
        return this.stack.entries().at(-1)!
    }

    clear(): void {
        this.stack.clear();
    }
}


export default KeyboardShapeGenerator;