import type { Node as GenricNode, Parent as GenericParent } from 'unist';

import { useMemo, } from 'react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'

const isParent = (node: GenricNode | GenericParent): node is GenericParent => {
    return (node as any).children;
};

const removePosition = (node: GenricNode | GenericParent): any => {
    if (isParent(node)) {
        const { position: _, children, ...rest } = node;
        return {
            ...rest,
            children: children.map(child => removePosition(child)),
        }
    }

    const { position: _, ...rest } = node;

    return rest;
};


export const useASTObject = (markdown: string) => {
    const astObject = useMemo(() => {
        const root = unified()
            .use(remarkParse)
            .use(remarkGfm)
            .parse(markdown);

        return root;
    }, [markdown]);

    const astObjectRemovedPosition = useMemo(() => {
        return removePosition(astObject);
    }, [astObject]);

    return { astObject: astObjectRemovedPosition };
};
