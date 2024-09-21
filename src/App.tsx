import { useState } from 'react'
import MDEditor from '@uiw/react-md-editor';

import styles from './styles.module.scss';

function App() {
  const [value, setValue] = useState("**Hello world!!!**");

  return (
    <div className={styles.root}>
      <MDEditor
        preview="edit"
        value={value}
        onChange={(v = "") => setValue(v)}
      />
    </div>
  )
}

export default App
