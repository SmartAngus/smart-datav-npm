import React from 'react'
import './style/index.scss'
import { EditorNode } from '../editor/common/EditorNode'
import { Group, Link, Node } from '../editor/constants/defines'

/**
 * 看版预览组件
 */
class DataVPreviewProps{
  editorData?:{
    nodes:Node[],
    groups:Group[],
    links:Link[],
    editorConfig:any;
  }
}
class DataVPreviewState{
  editorData?:{
    nodes:Node[],
    groups:Group[],
    links:Link[],
    editorConfig:any;
  };
  backgroundImage?:any
}
export default class DataVPreview extends React.Component<DataVPreviewProps, DataVPreviewState>{
  state = {
    editorData:this.props.editorData,
    backgroundImage:this.props.editorData?.editorConfig?.backgroundImage
  }
  constructor(props) {
    super(props);
  }
  componentDidMount(): void {

  }
  componentWillReceiveProps(nextProps: Readonly<DataVPreviewProps>, nextContext: any): void {
    this.setState({editorData:nextProps.editorData})
    if(nextProps.editorData?.editorConfig?.uploadBackgroundImage?.show){
      this.setState({backgroundImage: `url(${nextProps.editorData.editorConfig.uploadBackgroundImage.url})`})
    }else if(nextProps.editorData?.editorConfig?.backgroundImageKey){
      this.setState({backgroundImage:nextProps.editorData?.editorConfig?.backgroundImage})
    }
  }

  handleResize(){}
  // 渲染节点信息
  renderCanvas(): React.ReactNode {
    return (
      <div className="editor-preview"  style={{
        position:'relative',
        overflow:'auto',
        width:'100%',
        height:'100%',
      }}>
        <div className="editor-preview-content"
          style={{
            width: this.state.editorData?.editorConfig?.width,
            height: this.state.editorData?.editorConfig?.height,
            backgroundColor: this.state.editorData?.editorConfig?.backgroundColor,
            backgroundImage: this.state.backgroundImage,
            margin:'0 auto',
            position:'relative',
            overflow: "hidden",
            backgroundSize:"cover",
            backgroundPosition:"bottom",
            backgroundOrigin:"inherit"
          }}
        >
          {(this.state.editorData?.nodes || []).map((child,index) => {
            return (
              <EditorNode
                nodeRef={null}
                currentNode={child}
                key={index}
                isSelected={false}
                showSelector={false}
                interactive={false}
                onResize={this.handleResize}
              />
            );
          })}
        </div>
      </div>
    )
  }
  render(): React.ReactNode {
    return (
      <div>
        {this.renderCanvas()}
      </div>
    )
  }
}
