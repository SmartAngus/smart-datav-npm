import React,{useEffect,useState} from 'react'

import { DataVPreview,DataVEditor } from 'smart-datav-npm'
import 'antd/dist/antd.css'
import 'smart-datav-npm/dist/index.css'
import axios from "axios"
import { Modal } from 'antd'

const App = () => {
  const [editorData,setEditorData] = useState(undefined)
  useEffect( ()=>{
    // 获取数据
    const formData = new FormData()
    formData.append("mappingId","23233")
    formData.append("mappingType","107")
    const instance = axios.create({
      baseURL:'http://192.168.3.42:50010',
      timeout:10000000,
      maxContentLength:1000000000
    })
    instance.get("/api/applications/newBoard/detail",{
      method:'get',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'token':'development_of_special_token_by_star_quest',
        'Content-Type':'application/json'
      },
      params: {
        id: '1a99aa5c58144a7b8ce8230ace2c53b6'
      }
    }).then((res)=>{
      console.log("detail",res)
      if(res.data?.data?.property){
        if(res.data.data.property!=null&&res.data.data.property!=null){
          const getEditorData = JSON.parse(decodeURIComponent(escape(window.atob(res.data.data.property))));
          setEditorData(getEditorData)
        }
      }

      console.log(JSON.parse(decodeURIComponent(escape(window.atob(res.data.data.property)))))
    })
  },[])
  // 保存数据到数据库
  const handleSaveEditorData = (data:any)=>{
    console.log(data)
    const instance = axios.create({
      baseURL:'http://192.168.3.42:50010',
      timeout:10000000,
      maxContentLength:1000000000
    })
    instance.post("/api/applications/newBoard/updateProperty",{
      "id":"1a99aa5c58144a7b8ce8230ace2c53b6",
      "property":window.btoa(unescape(encodeURIComponent(JSON.stringify(data))))
    },{
      method:'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'token':'development_of_special_token_by_star_quest',
        'Content-Type':'application/json;charset=UTF-8'
      }
    }).then((res)=>{
      console.log("update==",res)
    })
  }
  // 自定义预览，多数为打开一个新页面，路由，内置的预览是弹窗
  const handlePreview = (data:any)=>{
    console.log(data)
  }
  const renderExtraModel = ()=>{
    return (
      <Modal
        title="预览"
        className="preview-modal"
        visible={true}
        onOk={handlePreview}
        onCancel={handlePreview}
        okText="确认"
        cancelText="取消"
      >
        <div>ssssss</div>
      </Modal>
    )
  }
  return (
    <React.Fragment>
      <DataVEditor onEditorSaveCb={handleSaveEditorData} editorData={editorData} onPreview={handlePreview} extraSetting={renderExtraModel}/>
      {/*<DataVPreview editorData={editorData}/>*/}
    </React.Fragment>
  )
}

export default App
