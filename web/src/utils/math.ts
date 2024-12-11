export function floorToOdd(n: number): number {
    const floored = Math.floor(n);
    if (floored % 2 == 1) {
        return floored;
    } else {
        return floored - 1;
    }
}