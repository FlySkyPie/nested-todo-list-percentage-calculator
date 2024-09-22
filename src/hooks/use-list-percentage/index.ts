import { useMemo } from 'react';

import type { List, Root } from '../../interfaces/mdast';

import { ListItemCounter } from './list-item-counter';

/**
 * Return AST object which calculated list items.
 */
export const useListPercentage = (root: Root<List>) => {
    const astObject = useMemo(() =>
        ListItemCounter.process(root), [root]);

    return { astObject };
};
