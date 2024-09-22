import type {
    Root, RootContent, List, ListItem,
    ListContent, Blockquote, FootnoteDefinition,
} from '../../interfaces/mdast';

type ListPlus = List & {
    totalCount: number;
    checkedCount: number;
    percentage: number;

    children: ListContent<ListPlus>[];
}

const processFootnoteDefinition = (node: FootnoteDefinition<List>, percentage: number): FootnoteDefinition<ListPlus> => {
    return {
        ...node,
        children: node.children.map(item => {
            if (!item.children) {
                return item;
            }

            if (item.type === 'blockquote') {
                return processBlockquote(item, percentage);
            }
            if (item.type === 'footnoteDefinition') {
                return processFootnoteDefinition(item, percentage);
            }
            if (item.type === 'heading') {
                return (item);
            }
            if (item.type === 'list') {
                return processList(item, percentage);
            }
            if (item.type === 'paragraph') {
                return item;
            }
            return item;
        }),
    };
};

const processBlockquote = (node: Blockquote<List>, percentage: number): Blockquote<ListPlus> => {
    return {
        ...node,
        children: node.children.map(item => {
            if (!item.children) {
                return item;
            }

            if (item.type === 'blockquote') {
                return processBlockquote(item, percentage);
            }
            if (item.type === 'footnoteDefinition') {
                return processFootnoteDefinition(item, percentage);
            }
            if (item.type === 'heading') {
                return (item);
            }

            if (item.type === 'list') {
                return processList(item, percentage);
            }
            if (item.type === 'paragraph') {
                return item;
            }

            return item;
        }),
    };
};

const processListContent = (node: ListContent<List>, percentage: number): ListContent<ListPlus> => {
    return {
        ...node,
        children: node.children.map(item => {
            if (!item.children) {
                return item;
            }

            if (item.type === 'blockquote') {
                return processBlockquote(item, percentage);
            }
            if (item.type === 'footnoteDefinition') {
                return processFootnoteDefinition(item, percentage);
            }
            if (item.type === 'heading') {
                return (item);
            }

            if (item.type === 'list') {
                return processList(item, percentage);
            }
            if (item.type === 'paragraph') {
                return item;
            }

            return item;
        }),
    };
}

const processList = (node: List, _percentage: number): ListPlus => {
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

    const percentage = totalCount === 0 ? 1 :
        _percentage / totalCount;

    return {
        ...node,
        children: node.children.map((item) => processListContent(item, percentage)),
        totalCount,
        checkedCount,
        percentage: _percentage * checkedCount / totalCount,
    };
};

const processListItem = (node: ListItem<List>, percentage: number): ListItem<ListPlus> => {
    return {
        ...node,
        children: node.children.map(item => {
            if (!item.children) {
                return item;
            }

            if (item.type === 'blockquote') {
                return processBlockquote(item, percentage);
            }
            if (item.type === 'footnoteDefinition') {
                return processFootnoteDefinition(item, percentage);
            }
            if (item.type === 'heading') {
                return (item);
            }

            if (item.type === 'list') {
                return processList(item, percentage);
            }
            if (item.type === 'paragraph') {
                return item;
            }

            return item;
        }),
    };
};

const processRootContent = (node: RootContent<List>): RootContent<ListPlus> => {
    if (node.type === 'list') {
        return processList(node, 1.0);
    }

    if (!node.children) {
        return node;
    }

    if (node.type === 'blockquote') {
        return processBlockquote(node, 1.0);
    }

    if (node.type === 'delete') {
        return node;
    }
    if (node.type === 'emphasis') {
        return node;
    }
    if (node.type === 'footnoteDefinition') {
        return processFootnoteDefinition(node, 1.0);
    }
    if (node.type === 'heading') {
        return node;
    }
    if (node.type === 'link') {
        return node;
    }
    if (node.type === 'linkReference') {
        return node;
    }
    if (node.type === 'listItem') {
        return processListItem(node, 1.0);
    }
    if (node.type === 'paragraph') {
        return node;
    }
    if (node.type === 'strong') {
        return node;
    }
    if (node.type === 'table') {
        return node;
    }
    if (node.type === 'tableCell') {
        return node;
    }

    return node;
};

export const processRoot = (root: Root<List>): Root<ListPlus> => {
    return {
        ...root,
        children: root.children.map(processRootContent),
    }
};
