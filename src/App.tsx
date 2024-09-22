import { useMemo, useState } from 'react'
import MDEditor from '@uiw/react-md-editor';
import { toMarkdown } from 'mdast-util-to-markdown'
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

import { useASTObject } from './hooks/use-ast-object';
import { useListPercentage } from './hooks/use-list-percentage';
import { useMdAstWithPercentage } from './hooks/use-md-ast-with-percentage';
import sampleMdStr from './data/sample.md?raw';
import styles from './styles.module.scss';

function App() {
  const [value, setValue] = useState(sampleMdStr);
  const { astObject: root } = useASTObject(value);
  const { astObject: _root } = useListPercentage(root);
  const { astObject } = useMdAstWithPercentage(_root);
  const mdStr = useMemo(() => toMarkdown(astObject), [astObject]);

  return (
    <div className={styles.root}>
      <MDEditor
        preview="edit"
        extraCommands={[]}
        value={value}
        onChange={(v = "") => setValue(v)}
      />
      <div>
        <JsonView
          data={astObject}
          shouldExpandNode={allExpanded}
          style={defaultStyles} />
      </div>
      <div>
        <MDEditor.Markdown source={mdStr} style={{ whiteSpace: 'pre-wrap' }} />
      </div>
    </div>
  )
}

export default App
