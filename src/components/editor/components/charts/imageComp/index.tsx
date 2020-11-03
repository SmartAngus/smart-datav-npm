import React from 'react'
import { Node } from '../../../constants/defines'
class TimeCompProps{
  node?:Node;
  onEditDone?:(node:Node)=>void;
}

/**
 * 所有图库组件图片的包装组件
 * @param props
 * @param ref
 * @constructor
 */
const ImageComp:React.FC<TimeCompProps> =  (props,ref)=>{
  const {node} = props;
  return (
    <div className="image-box">
      <img src={node.url} alt="" style={{
        width:node.width,
        height:node.height
      }}/>
    </div>
  )
}
export default ImageComp;
