


export function arrayOfNotNull<T>(array: (T | undefined | null)[]): T[] {
    return array.filter(it => it !== undefined && it !== null) as T[]
}