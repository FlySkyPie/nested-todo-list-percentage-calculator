import { useMemo } from 'react';

import type { Root } from '../../interfaces/mdast';

import type { ListPlus, } from './percentage-indicator';
import { PercentageIndicator } from './percentage-indicator';

/**
 * Return AST object which calculated list items.
 */
export const useMdAstWithPercentage = (root: Root<ListPlus>) => {
    const astObject = useMemo(() =>
        PercentageIndicator.process(root), [root]);

    return { astObject };
};
