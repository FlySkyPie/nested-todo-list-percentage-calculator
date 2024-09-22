import type {
    Root, RootContent, List, ListItem,
    ListContent, Blockquote, FootnoteDefinition,
} from '../../interfaces/mdast';

type ListPlus = Omit<List, 'children'> & {
    totalCount: number;
    checkedCount: number;
    percentage: number;

    children: ListContent<ListPlus>[];
}

export abstract class ListItemCounter {
    public static process = (root: Root<List>): Root<ListPlus> => {
        return {
            ...root,
            children: root.children.map(ListItemCounter.processRootContent),
        }
    };

    private static processFootnoteDefinition = (node: FootnoteDefinition<List>, percentage: number): FootnoteDefinition<ListPlus> => {
        return {
            ...node,
            children: node.children.map(item => {
                if (!item.children) {
                    return item;
                }

                if (item.type === 'blockquote') {
                    return ListItemCounter.processBlockquote(item, percentage);
                }
                if (item.type === 'footnoteDefinition') {
                    return ListItemCounter.processFootnoteDefinition(item, percentage);
                }
                if (item.type === 'heading') {
                    return (item);
                }
                if (item.type === 'list') {
                    return ListItemCounter.processList(item, percentage);
                }
                if (item.type === 'paragraph') {
                    return item;
                }
                return item;
            }),
        };
    };

    private static processBlockquote = (node: Blockquote<List>, percentage: number): Blockquote<ListPlus> => {
        return {
            ...node,
            children: node.children.map(item => {
                if (!item.children) {
                    return item;
                }

                if (item.type === 'blockquote') {
                    return ListItemCounter.processBlockquote(item, percentage);
                }
                if (item.type === 'footnoteDefinition') {
                    return ListItemCounter.processFootnoteDefinition(item, percentage);
                }
                if (item.type === 'heading') {
                    return (item);
                }

                if (item.type === 'list') {
                    return ListItemCounter.processList(item, percentage);
                }
                if (item.type === 'paragraph') {
                    return item;
                }

                return item;
            }),
        };
    };

    private static processListContent = (node: ListContent<List>, percentage: number): ListContent<ListPlus> => {
        return {
            ...node,
            children: node.children.map(item => {
                if (!item.children) {
                    return item;
                }

                if (item.type === 'blockquote') {
                    return ListItemCounter.processBlockquote(item, percentage);
                }
                if (item.type === 'footnoteDefinition') {
                    return ListItemCounter.processFootnoteDefinition(item, percentage);
                }
                if (item.type === 'heading') {
                    return (item);
                }

                if (item.type === 'list') {
                    return ListItemCounter.processList(item, percentage);
                }
                if (item.type === 'paragraph') {
                    return item;
                }

                return item;
            }),
        };
    }

    private static processList = (node: List, _percentage: number): ListPlus => {
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
            children: node.children.map((item) => ListItemCounter.processListContent(item, percentage)),
            totalCount,
            checkedCount,
            percentage: _percentage * checkedCount / totalCount,
        };
    };

    private static processListItem = (node: ListItem<List>, percentage: number): ListItem<ListPlus> => {
        return {
            ...node,
            children: node.children.map(item => {
                if (!item.children) {
                    return item;
                }

                if (item.type === 'blockquote') {
                    return ListItemCounter.processBlockquote(item, percentage);
                }
                if (item.type === 'footnoteDefinition') {
                    return ListItemCounter.processFootnoteDefinition(item, percentage);
                }
                if (item.type === 'heading') {
                    return (item);
                }

                if (item.type === 'list') {
                    return ListItemCounter.processList(item, percentage);
                }
                if (item.type === 'paragraph') {
                    return item;
                }

                return item;
            }),
        };
    };

    private static processRootContent = (node: RootContent<List>): RootContent<ListPlus> => {
        if (node.type === 'list') {
            return ListItemCounter.processList(node, 1.0);
        }

        if (!node.children) {
            return node;
        }

        if (node.type === 'blockquote') {
            return ListItemCounter.processBlockquote(node, 1.0);
        }

        if (node.type === 'delete') {
            return node;
        }
        if (node.type === 'emphasis') {
            return node;
        }
        if (node.type === 'footnoteDefinition') {
            return ListItemCounter.processFootnoteDefinition(node, 1.0);
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
            return ListItemCounter.processListItem(node, 1.0);
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
};
