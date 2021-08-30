export type Tree<L> =
    | L
    | {
          value: L;
          children: Tree<L>[];
      };

export type NumberTree<T> = number | { [x in keyof T]: NumberTree<T[x]> };

export function total<T>(tree: NumberTree<T>): number {
    if (typeof tree === "number") {
        return tree;
    }

    let sum = 0;
    for (const x in tree) {
        sum += total(tree[x]);
    }

    return sum;
}
