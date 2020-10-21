import React from 'react'
import { Upload, Icon, Modal } from 'antd';
import { UploadFile, UploadListType } from 'antd/es/upload/interface'
import axios from 'axios'
import { ImageProps } from '../../constants/defines'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
interface IndustrialLibraryUploadProps {
  onUploadComplete?: (newFile:UploadFile,files:UploadFile[])=>void;
  onRemoveFile?:(file:UploadFile)=>void;
  selfLibrary?:ImageProps[]
}

export default class IndustrialLibraryUpload extends React.Component<IndustrialLibraryUploadProps,any> {
  state = {
    previewVisible: false,
    previewImage: '',
    addFile:undefined,
    fileList: [],
  };
  componentDidMount() {

  }

  // 手动上传文件
  handleUpload = ()=>{
    const formData = new FormData()
    formData.append("file",this.state.addFile)
    formData.append("mappingId","23233")
    formData.append("mappingType","106")
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
      const {onUploadComplete} = this.props
      let fileList = this.state.fileList;
      let newFile = fileList.pop();
      newFile["url"] = res.data?.data[0]
      fileList.push(newFile)
      this.setState({fileList:fileList})
      console.log(this.state.fileList)
      onUploadComplete&&onUploadComplete(newFile,this.state.fileList)
    })
  }

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
    const timer = setTimeout(this.handleUpload,500);
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
