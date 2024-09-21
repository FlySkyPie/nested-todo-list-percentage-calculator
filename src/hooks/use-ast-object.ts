import { useMemo, } from 'react'
import remarkParse from 'remark-parse'
import { unified } from 'unified'

export const useASTObject = (markdown: string) => {
    const astObject = useMemo(() => {
        const root = unified()
            .use(remarkParse)
            .parse(markdown);

        return root;
    }, [markdown]);

    return { astObject };
};
