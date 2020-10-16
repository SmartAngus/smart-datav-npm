import React from "react"

const CircleComp:React.FC<any> = React.forwardRef((props,ref) =>{
    const {node} = props
    console.log("node==",node)
    return (
        <div className="editorNode-circle"
        style={{
            height:'100%',
            width:'100%',
            backgroundColor:'#fff',
            border: '1px solid #ccc'
        }}
        >

        </div>
    )
})
export default CircleComp;