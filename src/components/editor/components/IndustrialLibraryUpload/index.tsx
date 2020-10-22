import React from 'react'
import { Upload, Icon, Modal } from 'antd';
import { UploadFile, UploadListType } from 'antd/es/upload/interface'
import axios from 'axios'
import { ImageProps, UploadURIProps } from '../../constants/defines'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
// 工业上传组件
interface IndustrialLibraryUploadProps {
  onUploadComplete?: (newFile:UploadFile,files:UploadFile[])=>void;
  onRemoveFile?:(file:UploadFile)=>void;
  selfLibrary?:ImageProps[];
  uploadConfig?:UploadURIProps
}

export default class IndustrialLibraryUpload extends React.Component<IndustrialLibraryUploadProps,any> {
  state = {
    previewVisible: false,
    previewImage: '',
    addFile:undefined,
    fileList: [],
    timer:null,
  };
  componentDidMount() {

  }
  componentWillUnmount(): void {
    clearTimeout(this.state.timer)
  }

  // 手动上传文件
  handleUpload = ()=>{
    const {onUploadComplete,uploadConfig} = this.props
    const formData = new FormData()
    formData.append("file",this.state.addFile)
    for(let k in uploadConfig.data){
      formData.append(k,uploadConfig.data[k])
    }
    // formData.append("mappingId","23233")
    // formData.append("mappingType","106")
    const instance = axios.create({
      baseURL:uploadConfig?.baseURL,
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
      let fileList = this.state.fileList;
      let newFile = fileList.pop();
      newFile["url"] = res.data?.data[0]
      fileList.push(newFile)
      this.setState({fileList:fileList})
      onUploadComplete&&onUploadComplete(newFile,this.state.fileList)
    })
  }

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
    const timer = setTimeout(this.handleUpload,500);
    this.setState({timer:timer})
  }

  render() {
    const { fileList } = this.state;
    const { selfLibrary } = this.props;
    const newFileList = selfLibrary.concat(fileList)
    const uploadProps = {
      listType: 'picture-card' as UploadListType,
      onChange:this.handleChange,
      showUploadList:false,
      beforeUpload: file => {
        this.setState(state => ({
          addFile: file,
        }));
        return false;
      }
    }
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">添加</div>
      </div>
    );
    return (
      <div className="clearfix" draggable={false}>
        <Upload {...uploadProps}>
          {newFileList.length >= 8 ? null : uploadButton}
        </Upload>
      </div>
    );
  }
}
