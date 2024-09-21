import { useMemo, useState } from 'react'
import MDEditor from '@uiw/react-md-editor';
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';


import styles from './styles.module.scss';

function App() {
  const [value, setValue] = useState("**Hello world!!!**");

  const astObj = useMemo(() => {
    const root = unified()
      .use(remarkParse)
      .parse(value);

    return root;
  }, [value]);


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
          data={astObj}
          shouldExpandNode={allExpanded}
          style={defaultStyles} />
      </div>
    </div>
  )
}

export default App
