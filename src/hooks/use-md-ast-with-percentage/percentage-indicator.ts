import type {
    Root, RootContent, List, ListItem,
    ListContent, Blockquote, FootnoteDefinition,
} from '../../interfaces/mdast';

export type ListPlus = Omit<List, 'children'> & {
    totalCount: number;
    checkedCount: number;
    percentage: number;

    children: ListContent<ListPlus>[];
}

export abstract class PercentageIndicator {
    public static process = (root: Root<ListPlus>): Root<ListPlus> => {
        return {
            ...root,
            children: root.children.map(PercentageIndicator.processRootContent),
        }
    };

    private static processFootnoteDefinition = (node: FootnoteDefinition<ListPlus>): FootnoteDefinition<ListPlus> => {
        return {
            ...node,
            children: node.children.map(item => {
                if (!item.children) {
                    return item;
                }

                if (item.type === 'blockquote') {
                    return PercentageIndicator.processBlockquote(item);
                }
                if (item.type === 'footnoteDefinition') {
                    return PercentageIndicator.processFootnoteDefinition(item);
                }
                if (item.type === 'heading') {
                    return (item);
                }
                if (item.type === 'list') {
                    return PercentageIndicator.processList(item);
                }
                if (item.type === 'paragraph') {
                    return item;
                }
                return item;
            }),
        };
    };

    private static processBlockquote = (node: Blockquote<ListPlus>): Blockquote<ListPlus> => {
        return {
            ...node,
            children: node.children.map(item => {
                if (!item.children) {
                    return item;
                }

                if (item.type === 'blockquote') {
                    return PercentageIndicator.processBlockquote(item);
                }
                if (item.type === 'footnoteDefinition') {
                    return PercentageIndicator.processFootnoteDefinition(item);
                }
                if (item.type === 'heading') {
                    return (item);
                }

                if (item.type === 'list') {
                    return PercentageIndicator.processList(item);
                }
                if (item.type === 'paragraph') {
                    return item;
                }

                return item;
            }),
        };
    };

    private static processList = (node: ListPlus): ListPlus => {
        return {
            ...node,
            children: node.children.map((item) =>
                PercentageIndicator.processListItem(item)),
        };
    };

    private static processListItem = (node: ListItem<ListPlus>): ListItem<ListPlus> => {
        const paragraph = node.children.find(item => item.type === 'paragraph');
        const list = node.children.find(item => item.type === 'list');

        return {
            ...node,
            children: node.children.map(item => {
                if (!item.children) {
                    return item;
                }

                if (item.type === 'blockquote') {
                    return PercentageIndicator.processBlockquote(item);
                }
                if (item.type === 'footnoteDefinition') {
                    return PercentageIndicator.processFootnoteDefinition(item);
                }
                if (item.type === 'heading') {
                    return (item);
                }

                if (item.type === 'list') {
                    return PercentageIndicator.processList(item);
                }
                if (item.type === 'paragraph') {
                    if (!paragraph || !list) {
                        return item;
                    }

                    if (paragraph === item) {
                        return {
                            ...item,
                            children: [{
                                type: 'text',
                                value: `[${(list.percentage * 100).toFixed(0)}%] `,
                            },
                            ...item.children,],
                        };
                    }

                    return item;
                }

                return item;
            }),
        };
    };

    private static processRootContent = (node: RootContent<ListPlus>): RootContent<ListPlus> => {
        if (node.type === 'list') {
            return PercentageIndicator.processList(node);
        }

        if (!node.children) {
            return node;
        }

        if (node.type === 'blockquote') {
            return PercentageIndicator.processBlockquote(node);
        }

        if (node.type === 'delete') {
            return node;
        }
        if (node.type === 'emphasis') {
            return node;
        }
        if (node.type === 'footnoteDefinition') {
            return PercentageIndicator.processFootnoteDefinition(node);
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
            return PercentageIndicator.processListItem(node);
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
