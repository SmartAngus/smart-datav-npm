import React from "react"
import { Upload, Button, Icon } from 'antd';
import axios from "axios"
import { UploadFile } from 'antd/es/upload/interface'
import { UploadURIProps } from '../../constants/defines'
interface UploadBgImgProps {
  onUploadComplete?: (file:UploadFile)=>void;
  onRemoveFile?:(file:UploadFile)=>void;
  uploadConfig?:UploadURIProps
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
    this.setState({fileList:[]})
  }
  // 手动上传文件
  handleUpload = ()=>{
    const { uploadConfig } = this.props
    const formData = new FormData()
    formData.append("file",this.state.fileList[this.state.fileList.length-1])
    for(let k in uploadConfig.data){
      formData.append(k,uploadConfig.data[k])
    }
    // formData.append("mappingId","23233")
    // formData.append("mappingType","107")
    const instance = axios.create({
      baseURL:uploadConfig.baseURL,
      timeout:10000000,
      maxContentLength:1000000000
    })
    instance.post(uploadConfig.url,formData,{
      method:'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'token':uploadConfig.token,
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
    accept:'image/*',
    showUploadList:false,
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
