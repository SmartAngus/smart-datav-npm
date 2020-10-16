/**
 * 定义直线组件组件
 */
import React,{useRef,useEffect,useMemo} from "react"
import {Node} from "../../../constants/defines";
import './style.scss'
class TextCompProps{
    node?:Node;
    updateNodes?:(node:Node)=>void
}

const LineComp:React.FC<TextCompProps> = (props,ref) =>{
    const {node}=props
    const arrawUrl = `url(#${node.id}_${node.chart?.stroke?.endMarker})`;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            width={node.width}
            height={node.height}
        >

            <defs>
                <marker id="arrow"
                        markerUnits="strokeWidth"
                        markerWidth="12"
                        markerHeight="12"
                        viewBox="0 0 12 12"
                        refX="6"
                        refY="6"
                        orient="auto">
                    <path d="M2,2 L8,6 L2,8 L6,6 L2,2" style={{fill: "#000000"}} />
                </marker>
                <marker id={node.id+'_typical'}
                        markerWidth="5"
                        markerHeight="5"
                        refX="5.25"
                        orient="auto"
                        refY="2.25">
                    <path d="M 0 0 L 5 2 L 0 5" stroke={node.chart.stroke.color} fill="none"></path>
                </marker>
                <marker id={node.id+'_block'}
                        markerWidth="5"
                        markerHeight="5"
                        refX="5.25"
                        orient="auto"
                        refY="2.25">
                    <path d="M 0 0 L 5 2 L 0 5 Z" stroke={node.chart.stroke.color} fill={node.chart.stroke.color}></path>
                </marker>
                <marker id="markerArrow2"
                        markerWidth="5"
                        markerHeight="5"
                        refX="10"
                        refY="2.25">
                    <path d="M 0 0 L 5 2 L 0 5" stroke={node.chart.stroke.color} fill="none"></path>
                </marker>
            </defs>

            <line xmlns="http://www.w3.org/2000/svg"
                  x1="0"
                  y1={node.height/2}
                  x2={node.width} y2={node.height/2}
                  strokeDasharray={node.chart.stroke.dashArray}
                  className="dotted"
                  stroke={node.chart.stroke.color}
                  strokeWidth={node.chart.stroke.width}
                  markerEnd={arrawUrl}
                  markerStart="url(#markerArrow2)"
            />
        </svg>


    )
};

export default LineComp;





