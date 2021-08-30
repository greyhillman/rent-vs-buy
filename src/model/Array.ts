/* eslint-disable no-extend-native */

declare global {
    interface Array<T> {
        sum(this: number[]): number;
        zip<K>(other: K[]): [T, K][];
        zip_with<K, Z>(other: K[], fn: (tuple: [T, K]) => Z): Z[];
        replace_at(index: number, value: T): T[];
    }
}

export function sum(this: number[]): number {
    return this.reduce((acc, x) => acc + x, 0);
}

Array.prototype.sum = sum;

export function zip<T, K>(this: T[], other: K[]): [T, K][] {
    const min_length = Math.min(this.length, other.length);

    return this.filter((_, i) => i < min_length).map((value, i) => [
        value,
        other[i],
    ]);
}

Array.prototype.zip = zip;

export function zip_with<T, K, Z>(
    this: T[],
    other: K[],
    fn: (tuple: [T, K]) => Z
): Z[] {
    return this.zip(other).map(fn);
}

Array.prototype.zip_with = zip_with;

export function replace_at<T>(this: T[], index: number, value: T): T[] {
    return this.map((x, i) => (i === index ? value : x));
}

Array.prototype.replace_at = replace_at;
