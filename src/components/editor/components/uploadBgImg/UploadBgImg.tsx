import React from "react"
import { Upload, Button, Icon } from 'antd';
import * as _ from 'lodash'
import axios from "axios"
import { UploadFile } from 'antd/es/upload/interface'
interface UploadBgImgProps {
  onUploadComplete?: (file:UploadFile)=>void;
  onRemoveFile?:(file:UploadFile)=>void
}
class UploadBgImg extends React.Component<UploadBgImgProps> {
  state = {
    fileList: [],
    uploading: false,
    timer:null
  };
  constructor(props) {
    super(props);
  }
  componentWillUnmount(): void {
    // 清除定时器
    clearTimeout(this.state.timer)
  }

  handleRemove = (file)=>{
    console.log("aaaa")
    this.setState({fileList:[]})
  }
  // 手动上传文件
  handleUpload = ()=>{
    const formData = new FormData()
    formData.append("file",this.state.fileList[0])
    formData.append("mappingId","23233")
    formData.append("mappingType","107")
    const instance = axios.create({
      baseURL:'http://192.168.3.42:50010',
      timeout:10000000,
      maxContentLength:1000000000
    })
    instance.post("/api/file/file/uploadReturnPath",formData,{
      method:'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'token':'development_of_special_token_by_star_quest',
        'Content-Type':'multipart/form-data'
      }
    }).then((res)=>{
      const { onUploadComplete } = this.props;
      const file = this.state.fileList[0];
      file.url = res.data.data[0]
      this.setState({fileList:[file]})
      onUploadComplete&&onUploadComplete(file)
    })
  }

  uploadProps = {
    handleRemove: this.handleRemove,
    multiple: false,
    beforeUpload: file => {
      this.setState(state => ({
        fileList: [...this.state.fileList, file],
      }));
      return false;
    },
    onChange:info=>{
      const timer = setTimeout(this.handleUpload,500);
      this.setState({timer:timer})
    }
  };


  render() {
      return (
        <React.Fragment>
          <Upload {...this.uploadProps} >
            <Button>
              <Icon type="upload" /> 上传图片
            </Button>
          </Upload>
        </React.Fragment>
      );
  }
}

export default UploadBgImg;
