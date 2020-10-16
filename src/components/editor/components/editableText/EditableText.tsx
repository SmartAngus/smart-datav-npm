import React from "react"


const EditableText = (props:any)=>{
    const {node} = props;

    return (
        <div className="editor-node" style={{
            width:node.width,
            height:node.height,
            top:node.y,
            left:node.x,
        }} contentEditable="true">{node.name}</div>
    )
}
export default EditableText;