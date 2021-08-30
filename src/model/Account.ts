interface LeafAccount {
    name: string;
    value: number;
}

export type AccountTree = LeafAccount & { children: AccountTree[] };

export function leaf_account(name: string, value: number): AccountTree {
    return {
        name,
        value,
        children: [],
    };
}

function tree_sum(tree: AccountTree): number {
    if (tree.value !== undefined) {
        return tree.value;
    }

    return tree.children.map((c) => tree_sum(c)).sum();
}

export function from_accounts(
    name: string,
    children: AccountTree[],
    value?: number
): AccountTree {
    return {
        name,
        value: value ?? children.map(tree_sum).sum(),
        children: children,
    };
}

export function to_account(name: string, value: number): LeafAccount {
    return {
        name,
        value,
    };
}
