import type { Data as UnistData, Literal as UnistLiteral, Node as UnistNode, Parent as UnistParent } from "unist";

// ## Enumeration

/**
 * How phrasing content is aligned
 * ({@link https://drafts.csswg.org/css-text/ | [CSSTEXT]}).
 *
 * * `'left'`: See the
 *   {@link https://drafts.csswg.org/css-text/#valdef-text-align-left | left}
 *   value of the `text-align` CSS property
 * * `'right'`: See the
 *   {@link https://drafts.csswg.org/css-text/#valdef-text-align-right | right}
 *   value of the `text-align` CSS property
 * * `'center'`: See the
 *   {@link https://drafts.csswg.org/css-text/#valdef-text-align-center | center}
 *   value of the `text-align` CSS property
 * * `null`: phrasing content is aligned as defined by the host environment
 *
 * Used in GFM tables.
 */
export type AlignType = "center" | "left" | "right" | null;

/**
 * Explicitness of a reference.
 *
 * `'shortcut'`: the reference is implicit, its identifier inferred from its
 *   content
 * `'collapsed'`: the reference is explicit, its identifier inferred from its
 *   content
 * `'full'`: the reference is explicit, its identifier explicitly set
 */
export type ReferenceType = "shortcut" | "collapsed" | "full";

// ## Mixin

/**
 * Node with a fallback.
 */
export interface Alternative {
    /**
     * Equivalent content for environments that cannot represent the node as
     * intended.
     */
    alt?: string | null | undefined;
}

/**
 * Internal relation from one node to another.
 *
 * Whether the value of `identifier` is expected to be a unique identifier or
 * not depends on the type of node including the Association.
 * An example of this is that they should be unique on {@link Definition},
 * whereas multiple {@link LinkReference}s can be non-unique to be associated
 * with one definition.
 */
export interface Association {
    /**
     * Relation of association.
     *
     * `identifier` is a source value: character escapes and character
     * references are not parsed.
     *
     * It can match another node.
     *
     * Its value must be normalized.
     * To normalize a value, collapse markdown whitespace (`[\t\n\r ]+`) to a space,
     * trim the optional initial and/or final space, and perform Unicode-aware
     * case-folding.
     */
    identifier: string;

    /**
     * Relation of association, in parsed form.
     *
     * `label` is a `string` value: it works just like `title` on {@link Link}
     * or a `lang` on {@link Code}: character escapes and character references
     * are parsed.
     *
     * It can match another node.
     */
    label?: string | null | undefined;
}

/**
 * Marker that is associated to another node.
 */
export interface Reference extends Association {
    /**
     * Explicitness of the reference.
     */
    referenceType: ReferenceType;
}

/**
 * Reference to resource.
 */
export interface Resource {
    /**
     * URL to the referenced resource.
     */
    url: string;
    /**
     * Advisory information for the resource, such as would be appropriate for
     * a tooltip.
     */
    title?: string | null | undefined;
}

// ## Interfaces

/**
 * Info associated with mdast nodes by the ecosystem.
 *
 * This space is guaranteed to never be specified by unist or mdast.
 * But you can use it in utilities and plugins to store data.
 *
 * This type can be augmented to register custom data.
 * For example:
 *
 * ```ts
 * declare module 'mdast' {
 *   interface Data {
 *     // `someNode.data.myId` is typed as `number | undefined`
 *     myId?: number | undefined
 *   }
 * }
 * ```
 */
export interface Data extends UnistData { }

// ## Content maps

/**
 * Union of registered mdast nodes that can occur where block content is
 * expected.
 *
 * To register custom mdast nodes, add them to {@link BlockContentMap}.
 * They will be automatically added here.
 */
export type BlockContent<TList> = BlockContentMap<TList>[keyof BlockContentMap<TList>];

/**
 * Registry of all mdast nodes that can occur where {@link BlockContent} is
 * expected.
 *
 * This interface can be augmented to register custom node types:
 *
 * ```ts
 * declare module 'mdast' {
 *   interface BlockContentMap {
 *     // Allow using MDX ESM nodes defined by `remark-mdx`.
 *     mdxjsEsm: MdxjsEsm;
 *   }
 * }
 * ```
 *
 * For a union of all block content, see {@link RootContent}.
 */
export interface BlockContentMap<TList> {
    blockquote: Blockquote<TList>;
    code: Code;
    heading: Heading<TList>;
    html: Html;
    list: TList;
    paragraph: Paragraph<TList>;
    table: Table<TList>;
    thematicBreak: ThematicBreak;
}

/**
 * Union of registered mdast nodes that can occur where definition content is
 * expected.
 *
 * To register custom mdast nodes, add them to {@link DefinitionContentMap}.
 * They will be automatically added here.
 */
export type DefinitionContent<TList> = DefinitionContentMap<TList>[keyof DefinitionContentMap<TList>];

/**
 * Registry of all mdast nodes that can occur where {@link DefinitionContent}
 * is expected.
 *
 * This interface can be augmented to register custom node types:
 *
 * ```ts
 * declare module 'mdast' {
 *   interface DefinitionContentMap {
 *     custom: Custom;
 *   }
 * }
 * ```
 *
 * For a union of all definition content, see {@link RootContent}.
 */
export interface DefinitionContentMap<TList> {
    definition: Definition;
    footnoteDefinition: FootnoteDefinition<TList>;
}

/**
 * Union of registered mdast nodes that can occur where frontmatter content is
 * expected.
 *
 * To register custom mdast nodes, add them to {@link FrontmatterContentMap}.
 * They will be automatically added here.
 */
export type FrontmatterContent = FrontmatterContentMap[keyof FrontmatterContentMap];

/**
 * Registry of all mdast nodes that can occur where {@link FrontmatterContent}
 * is expected.
 *
 * This interface can be augmented to register custom node types:
 *
 * ```ts
 * declare module 'mdast' {
 *   interface FrontmatterContentMap {
 *     // Allow using toml nodes defined by `remark-frontmatter`.
 *     toml: TOML;
 *   }
 * }
 * ```
 *
 * For a union of all frontmatter content, see {@link RootContent}.
 */
export interface FrontmatterContentMap {
    yaml: Yaml;
}

/**
 * Union of registered mdast nodes that can occur where list content is
 * expected.
 *
 * To register custom mdast nodes, add them to {@link ListContentMap}.
 * They will be automatically added here.
 */
export type ListContent<TList> = ListContentMap<TList>[keyof ListContentMap<TList>];

/**
 * Registry of all mdast nodes that can occur where {@link ListContent}
 * is expected.
 *
 * This interface can be augmented to register custom node types:
 *
 * ```ts
 * declare module 'mdast' {
 *   interface ListContentMap {
 *     custom: Custom;
 *   }
 * }
 * ```
 *
 * For a union of all list content, see {@link RootContent}.
 */
export interface ListContentMap<TList> {
    listItem: ListItem<TList>;
}

/**
 * Union of registered mdast nodes that can occur where phrasing content is
 * expected.
 *
 * To register custom mdast nodes, add them to {@link PhrasingContentMap}.
 * They will be automatically added here.
 */
export type PhrasingContent<TList> = PhrasingContentMap<TList>[keyof PhrasingContentMap<TList>];

/**
 * Registry of all mdast nodes that can occur where {@link PhrasingContent}
 * is expected.
 *
 * This interface can be augmented to register custom node types:
 *
 * ```ts
 * declare module 'mdast' {
 *   interface PhrasingContentMap {
 *     // Allow using MDX JSX (text) nodes defined by `remark-mdx`.
 *     mdxJsxTextElement: MDXJSXTextElement;
 *   }
 * }
 * ```
 *
 * For a union of all phrasing content, see {@link RootContent}.
 */
export interface PhrasingContentMap<TList> {
    break: Break;
    delete: Delete<TList>;
    emphasis: Emphasis<TList>;
    footnoteReference: FootnoteReference;
    html: Html;
    image: Image;
    imageReference: ImageReference;
    inlineCode: InlineCode;
    link: Link<TList>;
    linkReference: LinkReference<TList>;
    strong: Strong<TList>;
    text: Text;
}

/**
 * Union of registered mdast nodes that can occur in {@link Root}.
 *
 * To register custom mdast nodes, add them to {@link RootContentMap}.
 * They will be automatically added here.
 */
export type RootContent<TList> = RootContentMap<TList>[keyof RootContentMap<TList>];

/**
 * Registry of all mdast nodes that can occur as children of {@link Root}.
 *
 * > **Note**: {@link Root} does not need to be an entire document.
 * > it can also be a fragment.
 *
 * This interface can be augmented to register custom node types:
 *
 * ```ts
 * declare module 'mdast' {
 *   interface RootContentMap {
 *     // Allow using toml nodes defined by `remark-frontmatter`.
 *     toml: TOML;
 *   }
 * }
 * ```
 *
 * For a union of all {@link Root} children, see {@link RootContent}.
 */
export interface RootContentMap<TList> {
    blockquote: Blockquote<TList>;
    break: Break;
    code: Code;
    definition: Definition;
    delete: Delete<TList>;
    emphasis: Emphasis<TList>;
    footnoteDefinition: FootnoteDefinition<TList>;
    footnoteReference: FootnoteReference;
    heading: Heading<TList>;
    html: Html;
    image: Image;
    imageReference: ImageReference;
    inlineCode: InlineCode;
    link: Link<TList>;
    linkReference: LinkReference<TList>;
    list: TList;
    listItem: ListItem<TList>;
    paragraph: Paragraph<TList>;
    strong: Strong<TList>;
    table: Table<TList>;
    tableCell: TableCell<TList>;
    tableRow: TableRow<TList>;
    text: Text;
    thematicBreak: ThematicBreak;
    yaml: Yaml;
}

/**
 * Union of registered mdast nodes that can occur where row content is
 * expected.
 *
 * To register custom mdast nodes, add them to {@link RowContentMap}.
 * They will be automatically added here.
 */
export type RowContent<TList> = RowContentMap<TList>[keyof RowContentMap<TList>];

/**
 * Registry of all mdast nodes that can occur where {@link RowContent}
 * is expected.
 *
 * This interface can be augmented to register custom node types:
 *
 * ```ts
 * declare module 'mdast' {
 *   interface RowContentMap {
 *     custom: Custom;
 *   }
 * }
 * ```
 *
 * For a union of all row content, see {@link RootContent}.
 */
export interface RowContentMap<TList> {
    tableCell: TableCell<TList>;
}

/**
 * Union of registered mdast nodes that can occur where table content is
 * expected.
 *
 * To register custom mdast nodes, add them to {@link TableContentMap}.
 * They will be automatically added here.
 */
export type TableContent<TList> = TableContentMap<TList>[keyof TableContentMap<TList>];

/**
 * Registry of all mdast nodes that can occur where {@link TableContent}
 * is expected.
 *
 * This interface can be augmented to register custom node types:
 *
 * ```ts
 * declare module 'mdast' {
 *   interface TableContentMap {
 *     custom: Custom;
 *   }
 * }
 * ```
 *
 * For a union of all table content, see {@link RootContent}.
 */
export interface TableContentMap<TList> {
    tableRow: TableRow<TList>;
}

// ### Special content types

/**
 * Union of registered mdast nodes that can occur in {@link Root}.
 *
 * @deprecated Use {@link RootContent} instead.
 */
export type Content<TList> = RootContent<TList>;

/**
 * Union of registered mdast literals.
 *
 * To register custom mdast nodes, add them to {@link RootContentMap} and other
 * places where relevant.
 * They will be automatically added here.
 */
export type Literals<TList> = Extract<Nodes<TList>, UnistLiteral>;

/**
 * Union of registered mdast nodes.
 *
 * To register custom mdast nodes, add them to {@link RootContentMap} and other
 * places where relevant.
 * They will be automatically added here.
 */
export type Nodes<TList> = Root<TList> | RootContent<TList>;

/**
 * Union of registered mdast parents.
 *
 * To register custom mdast nodes, add them to {@link RootContentMap} and other
 * places where relevant.
 * They will be automatically added here.
 */
export type Parents<TList> = Extract<Nodes<TList>, UnistParent>;

/**
 * Union of registered mdast nodes that can occur at the top of the document.
 *
 * To register custom mdast nodes, add them to {@link BlockContent},
 * {@link FrontmatterContent}, or {@link DefinitionContent}.
 * They will be automatically added here.
 */
export type TopLevelContent<TList> = BlockContent<TList> | FrontmatterContent | DefinitionContent<TList>;

// ## Abstract nodes

/**
 * Abstract mdast node that contains the smallest possible value.
 *
 * This interface is supposed to be extended if you make custom mdast nodes.
 *
 * For a union of all registered mdast literals, see {@link Literals}.
 */
export interface Literal extends Node {
    /**
     * Plain-text value.
     */
    value: string;
}

/**
 * Abstract mdast node.
 *
 * This interface is supposed to be extended.
 * If you can use {@link Literal} or {@link Parent}, you should.
 * But for example in markdown, a thematic break (`***`) is neither literal nor
 * parent, but still a node.
 *
 * To register custom mdast nodes, add them to {@link RootContentMap} and other
 * places where relevant (such as {@link ElementContentMap}).
 *
 * For a union of all registered mdast nodes, see {@link Nodes}.
 */
export interface Node extends UnistNode {
    /**
     * Info from the ecosystem.
     */
    data?: Data | undefined;

    children?: undefined;
}

/**
 * Abstract mdast node that contains other mdast nodes (*children*).
 *
 * This interface is supposed to be extended if you make custom mdast nodes.
 *
 * For a union of all registered mdast parents, see {@link Parents}.
 */
export interface Parent<TList> extends UnistNode {
    /**
     * Info from the ecosystem.
     */
    data?: Data | undefined;

    /**
     * List of children.
     */
    children: RootContent<TList>[];
}

// ## Concrete nodes

/**
 * Markdown block quote.
 */
export interface Blockquote<TList> extends Parent<TList> {
    /**
     * Node type of mdast block quote.
     */
    type: "blockquote";
    /**
     * Children of block quote.
     */
    children: Array<BlockContent<TList> | DefinitionContent<TList>>;
    /**
     * Data associated with the mdast block quote.
     */
    data?: BlockquoteData | undefined;
}

/**
 * Info associated with mdast block quote nodes by the ecosystem.
 */
export interface BlockquoteData extends Data { }

/**
 * Markdown break.
 */
export interface Break extends Node {
    /**
     * Node type of mdast break.
     */
    type: "break";
    /**
     * Data associated with the mdast break.
     */
    data?: BreakData | undefined;
}

/**
 * Info associated with mdast break nodes by the ecosystem.
 */
export interface BreakData extends Data { }

/**
 * Markdown code (flow) (block).
 */
export interface Code extends Literal {
    /**
     * Node type of mdast code (flow).
     */
    type: "code";
    /**
     * Language of computer code being marked up.
     */
    lang?: string | null | undefined;
    /**
     * Custom information relating to the node.
     *
     * If the lang field is present, a meta field can be present.
     */
    meta?: string | null | undefined;
    /**
     * Data associated with the mdast code (flow).
     */
    data?: CodeData | undefined;
}

/**
 * Info associated with mdast code (flow) (block) nodes by the ecosystem.
 */
export interface CodeData extends Data { }

/**
 * Markdown definition.
 */
export interface Definition extends Node, Association, Resource {
    /**
     * Node type of mdast definition.
     */
    type: "definition";
    /**
     * Data associated with the mdast definition.
     */
    data?: DefinitionData | undefined;
}

/**
 * Info associated with mdast definition nodes by the ecosystem.
 */
export interface DefinitionData extends Data { }

/**
 * Markdown GFM delete (strikethrough).
 */
export interface Delete<TList> extends Parent<TList> {
    /**
     * Node type of mdast GFM delete.
     */
    type: "delete";
    /**
     * Children of GFM delete.
     */
    children: PhrasingContent<TList>[];
    /**
     * Data associated with the mdast GFM delete.
     */
    data?: DeleteData | undefined;
}

/**
 * Info associated with mdast GFM delete nodes by the ecosystem.
 */
export interface DeleteData extends Data { }

/**
 * Markdown emphasis.
 */
export interface Emphasis<TList> extends Parent<TList> {
    /**
     * Node type of mdast emphasis.
     */
    type: "emphasis";
    /**
     * Children of emphasis.
     */
    children: PhrasingContent<TList>[];
    /**
     * Data associated with the mdast emphasis.
     */
    data?: EmphasisData | undefined;
}

/**
 * Info associated with mdast emphasis nodes by the ecosystem.
 */
export interface EmphasisData extends Data { }

/**
 * Markdown GFM footnote definition.
 */
export interface FootnoteDefinition<TList> extends Parent<TList>, Association {
    /**
     * Node type of mdast GFM footnote definition.
     */
    type: "footnoteDefinition";
    /**
     * Children of GFM footnote definition.
     */
    children: Array<BlockContent<TList> | DefinitionContent<TList>>;
    /**
     * Data associated with the mdast GFM footnote definition.
     */
    data?: FootnoteDefinitionData | undefined;
}

/**
 * Info associated with mdast GFM footnote definition nodes by the ecosystem.
 */
export interface FootnoteDefinitionData extends Data { }

/**
 * Markdown GFM footnote reference.
 */
export interface FootnoteReference extends Association, Node {
    /**
     * Node type of mdast GFM footnote reference.
     */
    type: "footnoteReference";
    /**
     * Data associated with the mdast GFM footnote reference.
     */
    data?: FootnoteReferenceData | undefined;
}

/**
 * Info associated with mdast GFM footnote reference nodes by the ecosystem.
 */
export interface FootnoteReferenceData extends Data { }

/**
 * Markdown heading.
 */
export interface Heading<TList> extends Parent<TList> {
    /**
     * Node type of mdast heading.
     */
    type: "heading";
    /**
     * Heading rank.
     *
     * A value of `1` is said to be the highest rank and `6` the lowest.
     */
    depth: 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * Children of heading.
     */
    children: PhrasingContent<TList>[];
    /**
     * Data associated with the mdast heading.
     */
    data?: HeadingData | undefined;
}

/**
 * Info associated with mdast heading nodes by the ecosystem.
 */
export interface HeadingData extends Data { }

/**
 * Markdown HTML.
 */
export interface Html extends Literal {
    /**
     * Node type of mdast HTML.
     */
    type: "html";
    /**
     * Data associated with the mdast HTML.
     */
    data?: HtmlData | undefined;
}

/**
 * Info associated with mdast HTML nodes by the ecosystem.
 */
export interface HtmlData extends Data { }

/**
 * Old name of `Html` node.
 *
 * @deprecated
 *   Please use `Html` instead.
 */
export type HTML = Html;

/**
 * Markdown image.
 */
export interface Image extends Alternative, Node, Resource {
    /**
     * Node type of mdast image.
     */
    type: "image";
    /**
     * Data associated with the mdast image.
     */
    data?: ImageData | undefined;
}

/**
 * Info associated with mdast image nodes by the ecosystem.
 */
export interface ImageData extends Data { }

/**
 * Markdown image reference.
 */
export interface ImageReference extends Alternative, Node, Reference {
    /**
     * Node type of mdast image reference.
     */
    type: "imageReference";
    /**
     * Data associated with the mdast image reference.
     */
    data?: ImageReferenceData | undefined;
}

/**
 * Info associated with mdast image reference nodes by the ecosystem.
 */
export interface ImageReferenceData extends Data { }

/**
 * Markdown code (text) (inline).
 */
export interface InlineCode extends Literal {
    /**
     * Node type of mdast code (text).
     */
    type: "inlineCode";
    /**
     * Data associated with the mdast code (text).
     */
    data?: InlineCodeData | undefined;
}

/**
 * Info associated with mdast code (text) (inline) nodes by the ecosystem.
 */
export interface InlineCodeData extends Data { }

/**
 * Markdown link.
 */
export interface Link<TList> extends Parent<TList>, Resource {
    /**
     * Node type of mdast link.
     */
    type: "link";
    /**
     * Children of link.
     */
    children: PhrasingContent<TList>[];
    /**
     * Data associated with the mdast link.
     */
    data?: LinkData | undefined;
}

/**
 * Info associated with mdast link nodes by the ecosystem.
 */
export interface LinkData extends Data { }

/**
 * Markdown link reference.
 */
export interface LinkReference<TList> extends Parent<TList>, Reference {
    /**
     * Node type of mdast link reference.
     */
    type: "linkReference";
    /**
     * Children of link reference.
     */
    children: PhrasingContent<TList>[];
    /**
     * Data associated with the mdast link reference.
     */
    data?: LinkReferenceData | undefined;
}

/**
 * Info associated with mdast link reference nodes by the ecosystem.
 */
export interface LinkReferenceData extends Data { }

/**
 * Markdown list.
 */
export interface List extends Parent<List> {
    /**
     * Node type of mdast list.
     */
    type: "list";
    /**
     * Whether the items have been intentionally ordered (when `true`), or that
     * the order of items is not important (when `false` or not present).
     */
    ordered?: boolean | null | undefined;
    /**
     * The starting number of the list, when the `ordered` field is `true`.
     */
    start?: number | null | undefined;
    /**
     * Whether one or more of the children are separated with a blank line from
     * its siblings (when `true`), or not (when `false` or not present).
     */
    spread?: boolean | null | undefined;
    /**
     * Children of list.
     */
    children: ListContent<List>[];
    /**
     * Data associated with the mdast list.
     */
    data?: ListData | undefined;
}

/**
 * Info associated with mdast list nodes by the ecosystem.
 */
export interface ListData extends Data { }

/**
 * Markdown list item.
 */
export interface ListItem<TList> extends Parent<TList> {
    /**
     * Node type of mdast list item.
     */
    type: "listItem";
    /**
     * Whether the item is a tasklist item (when `boolean`).
     *
     * When `true`, the item is complete.
     * When `false`, the item is incomplete.
     */
    checked?: boolean | null | undefined;
    /**
     * Whether one or more of the children are separated with a blank line from
     * its siblings (when `true`), or not (when `false` or not present).
     */
    spread?: boolean | null | undefined;
    /**
     * Children of list item.
     */
    children: Array<BlockContent<TList> | DefinitionContent<TList>>;
    /**
     * Data associated with the mdast list item.
     */
    data?: ListItemData | undefined;
}

/**
 * Info associated with mdast list item nodes by the ecosystem.
 */
export interface ListItemData extends Data { }

/**
 * Markdown paragraph.
 */
export interface Paragraph<TList> extends Parent<TList> {
    /**
     * Node type of mdast paragraph.
     */
    type: "paragraph";
    /**
     * Children of paragraph.
     */
    children: PhrasingContent<TList>[];
    /**
     * Data associated with the mdast paragraph.
     */
    data?: ParagraphData | undefined;
}

/**
 * Info associated with mdast paragraph nodes by the ecosystem.
 */
export interface ParagraphData extends Data { }

/**
 * Document fragment or a whole document.
 *
 * Should be used as the root of a tree and must not be used as a child.
 */
export interface Root<TList> extends Parent<TList> {
    /**
     * Node type of mdast root.
     */
    type: "root";
    /**
     * Data associated with the mdast root.
     */
    data?: RootData | undefined;
}

/**
 * Info associated with mdast root nodes by the ecosystem.
 */
export interface RootData extends Data { }

/**
 * Markdown strong.
 */
export interface Strong<TList> extends Parent<TList> {
    /**
     * Node type of mdast strong.
     */
    type: "strong";
    /**
     * Children of strong.
     */
    children: PhrasingContent<TList>[];
    /**
     * Data associated with the mdast strong.
     */
    data?: StrongData | undefined;
}

/**
 * Info associated with mdast strong nodes by the ecosystem.
 */
export interface StrongData extends Data { }

/**
 * Markdown GFM table.
 */
export interface Table<TList> extends Parent<TList> {
    /**
     * Node type of mdast GFM table.
     */
    type: "table";
    /**
     * How cells in columns are aligned.
     */
    align?: AlignType[] | null | undefined;
    /**
     * Children of GFM table.
     */
    children: TableContent<TList>[];
    /**
     * Data associated with the mdast GFM table.
     */
    data?: TableData | undefined;
}

/**
 * Info associated with mdast GFM table nodes by the ecosystem.
 */
export interface TableData extends Data { }

/**
 * Markdown GFM table row.
 */
export interface TableRow<TList> extends Parent<TList> {
    /**
     * Node type of mdast GFM table row.
     */
    type: "tableRow";
    /**
     * Children of GFM table row.
     */
    children: RowContent<TList>[];
    /**
     * Data associated with the mdast GFM table row.
     */
    data?: TableRowData | undefined;
}

/**
 * Info associated with mdast GFM table row nodes by the ecosystem.
 */
export interface TableRowData extends Data { }

/**
 * Markdown GFM table cell.
 */
export interface TableCell<TList> extends Parent<TList> {
    /**
     * Node type of mdast GFM table cell.
     */
    type: "tableCell";
    /**
     * Children of GFM table cell.
     */
    children: PhrasingContent<TList>[];
    /**
     * Data associated with the mdast GFM table cell.
     */
    data?: TableCellData | undefined;
}

/**
 * Info associated with mdast GFM table cell nodes by the ecosystem.
 */
export interface TableCellData extends Data { }

/**
 * Markdown text.
 */
export interface Text extends Literal {
    /**
     * Node type of mdast text.
     */
    type: "text";
    /**
     * Data associated with the mdast text.
     */
    data?: TextData | undefined;
}

/**
 * Info associated with mdast text nodes by the ecosystem.
 */
export interface TextData extends Data { }

/**
 * Markdown thematic break (horizontal rule).
 */
export interface ThematicBreak extends Node {
    /**
     * Node type of mdast thematic break.
     */
    type: "thematicBreak";
    /**
     * Data associated with the mdast thematic break.
     */
    data?: ThematicBreakData | undefined;
}

/**
 * Info associated with mdast thematic break nodes by the ecosystem.
 */
export interface ThematicBreakData extends Data { }

/**
 * Markdown YAML.
 */
export interface Yaml extends Literal {
    /**
     * Node type of mdast YAML.
     */
    type: "yaml";
    /**
     * Data associated with the mdast YAML.
     */
    data?: YamlData | undefined;
}

/**
 * Info associated with mdast YAML nodes by the ecosystem.
 */
export interface YamlData extends Data { }

/**
 * Old name of `Yaml` node.
 *
 * @deprecated
 *   Please use `Yaml` instead.
 */
export type YAML = Yaml;
