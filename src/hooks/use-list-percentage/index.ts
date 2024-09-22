import { useMemo } from 'react';

import type { List, Root } from '../../interfaces/mdast';

import { processRoot } from './utils';

/**
 * Return AST object which calculated list items.
 */
export const useListPercentage = (root: Root<List>) => {
    const astObject = useMemo(() =>
        processRoot(root), [root]);

    return { astObject };
};
