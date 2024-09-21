import { useState } from 'react'
import MDEditor from '@uiw/react-md-editor';
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

import { useASTObject } from './hooks/use-ast-object';
import styles from './styles.module.scss';

function App() {
  const [value, setValue] = useState("- [ ] A Task");
  const { astObject } = useASTObject(value);

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
    </div>
  )
}

export default App
