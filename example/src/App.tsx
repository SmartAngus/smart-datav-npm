import React from 'react'

import { DataVEditor } from 'smart-datav-npm'
import 'antd/dist/antd.css'
import 'smart-datav-npm/dist/index.css'

const App = () => {
  const handleSaveEditorData = (data:any)=>{
    console.log(data)
  }
  return (
    <div>
      <DataVEditor onEditorSaveCb={handleSaveEditorData}/>
    </div>
    )
}

export default App
