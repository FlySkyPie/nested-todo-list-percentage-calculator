import type { Root, RootContent, List } from 'mdast';
import { useMemo } from 'react';

type ListPlus = List & {
    totalCount: number,
    checkedCount: number,
}

const calculate = (node: RootContent): RootContent | ListPlus => {
    if (node.type === 'list') {
        const { children } = node;
        let totalCount = 0;
        let checkedCount = 0;

        for (let index = 0; index < children.length; index++) {
            const item = children[index];
            if (item.checked !== null) {
                totalCount++;
            }
            if (item.checked === true) {
                checkedCount++;
            }

        }

        return {
            ...node,
            totalCount,
            checkedCount,
        }
    }

    return node;
}

const calculateRoot = (root: Root): Root => {


    return {
        ...root,
        children: root.children.map(calculate),
    }
}

/**
 * Return AST object which calculated list items.
 */
export const useListPercentage = (root: Root) => {
    const astObject = useMemo(() =>
        calculateRoot(root), [root]);

    return { astObject };
};
