import React from "react"
import { Upload, Button, Icon } from 'antd';
import * as _ from 'lodash'

class UploadBgImg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange: this.handleChange,
      handleRemove: this.handleRemove,
      fileList: [
        {
          uid: '3',
          type: 'png',
          size: 12345,
          name: 'zzz.png',
          response: 'Server Error 500', // custom error message to show
          url: 'http://www.baidu.com/zzz.png'
        }
      ]
    };
  }

    handleChange = info => {
      let fileList = [...info.fileList];

      // 1. Limit the number of uploaded files
      // Only to show two recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice(-1);

      // 2. Read from response and show file link
      fileList = fileList.map(file => {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.url;
        }
        return file;
      });

      this.setState({ fileList });
    };
    handleRemove = (file)=>{
      console.log("aaaa")
      this.setState({fileList:[]})
    }



    render() {
        return (
            <Upload {...this.state} >
                <Button>
                    <Icon type="upload" /> 上传图片
                </Button>
            </Upload>
        );
    }
}

export default UploadBgImg;
