/**
 * @file 通用节点组件
 * @desc 与画布联动，用于计算画布位置、缩放等
 * @author perkinJ
 */

import * as React from "react";
import {Icon} from 'antd'
import { useResize } from "../hooks/useResize";
import "./Node.scss";
import {BaseCompStyle, EChart,Stroke} from '../constants/defines'
const { useRef, useState, useEffect } = React;

class NodeProps {
  /** 节点id */
  id: string;

  /** 节点横坐标 */
  x: number;
  // 节点类型
  type:string;

  /** 节点纵坐标 */
  y: number;

  width: number;

  height: number;

  /** 点击节点 */
  onClick?: (event) => void;

  onDoubleClick?:(event)=>void;

  /** ContextMenu */
  onContextMenu?: (position: any, event) => void;

  /** 当前节点信息 */
  node?: any;

  /** 外部画布属性 */
  currTrans?: any;

  /** 是否被点击 */
  isSelected: boolean;

  children?: React.ReactNode;

  /** 改变节点大小 */
  onResize?: (width: number, height: number, x: number, y: number,lineRoate:number,stroke:Stroke) => void;

  /** chart 信息 */
  chart?:EChart;
  zIndex?:number;
  style?:BaseCompStyle;
  rotate?:number;
  onChangeZIndex?:(zIndex:number)=>void;
}

/**
 * 获取元素相对于页面的绝对位置
 */
export function getOffset(domNode: any) {
  let offsetTop = 0;
  let offsetLeft = 0;
  let targetDomNode = domNode;
  while (targetDomNode !== window.document.body && targetDomNode != null) {
    offsetLeft += targetDomNode.offsetLeft;
    offsetTop += targetDomNode.offsetTop;
    targetDomNode = targetDomNode.offsetParent;
  }
  return {
    offsetTop,
    offsetLeft
  };
}
// node组件开始
const Node = React.forwardRef((props: NodeProps, ref: any) => {
  const {
    x,
    y,
    id,
    chart,
    onClick,
    onDoubleClick,
    onContextMenu,
    children,
    currTrans,
    width,
    height,
    isSelected,
    onResize,
    rotate,
    onChangeZIndex,
    zIndex,
    type,
    style,
  } = props;

  const [showSelector, setShowSelector] = useState(false);
  const containerRef = useRef(null);

  // 获取伸缩的大小
  const {
    width: resizeWidth,
    height: resizeHeight,
    x: resizeX,
    y: resizeY,
    lineRotate,
    stroke,
  } = useResize(isSelected, {
    width,
    height,
    x,
    y,
    chart,
    rotate,
    zIndex,
    style,
  });
  const rotateDeg = lineRotate || rotate

  const handleContextMenu = (event: React.MouseEvent<any>) => {
    event.preventDefault();
    event.stopPropagation();
    const container = containerRef.current.getBoundingClientRect();
    container.id = id;
    const { offsetTop, offsetLeft } = getOffset(container.current);

    // The position ⟨x,y⟩ is transformed to ⟨xk + tx,yk + ty⟩
    const screenX = event.clientX - offsetLeft;
    const screenY = event.clientY - offsetTop;

    const newX = (screenX - x) / currTrans.k;
    const newY = (screenY - y) / currTrans.k;

    const currentPos = {
      left: newX,
      top: newY
    };

    if (onContextMenu) {
      onContextMenu(currentPos, event);
    }
  };

  const NODE_SELECTOR = [
    {
      position: "left",
      style: { left: "-5px", top: `${height / 2 - 5}px` }
    },
    {
      position: "right",
      style: { right: "-5px", top: `${height / 2 - 5}px` }
    },
    {
      position: "top",
      style: { left: `${width / 2 - 5}px`, top: "-5px" }
    },
    {
      position: "bottom",
      style: { left: `${width / 2 - 5}px`, top: `${height - 5}px` }
    }
  ];

  let RESIZE_SELECTOR = [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
    "rotate"
  ];
  let notLine = true
  if(chart?.type==='line'){// 如果是直线
    notLine=false
    RESIZE_SELECTOR = ["left","right"]
  }
  let isShowRotate = true;
  if(chart?.type==='time'||chart?.type==='text'){// 文本和时间不显示旋转
    isShowRotate=false
    RESIZE_SELECTOR.pop()
  }


  // 伸缩器
  const renderResize = (
    <div className="resizable">
      <div className="resizers">
        {RESIZE_SELECTOR.map(item => {
          if (item === 'rotate' && notLine) {
            return (
                <a
                    key="top-rotate"
                    data-type="rotate"
                    data-position="top-rotate"
                    className={`node-selector-rotate`}
                    style={{left: `${width / 2 - 14}px`,top:-25,color:'#000',cursor:"all-scroll",fontSize:16,fontWeight:800}}
                >
                  <Icon type="reload"/>
                  <span
                      data-type="rotate"
                      data-position="top-rotate"
                      className={`node-selector-rotate`}
                      style={{width:"100%",height:"100%",zIndex:2,background:'red',left:0,opacity:0}}
                  ></span>
                </a>
            )
          }else{
            return <div key={item} className={`resizer ${item}`} data-type="resize" />
          }
        })}
      </div>
    </div>
  );

  // 连线节点选择器
  const renderNodeSelector = (
    <div className="editor-node-selector" style={{ width, height }}>
      {NODE_SELECTOR.map(item => {
        return (
          <a
            data-type="edge"
            data-position={item.position}
            key={item.position}
            className={`node-selector`}
            style={item.style}
          />
        );
      })}
    </div>
  );

  useEffect(() => {
    onResize(resizeWidth, resizeHeight, resizeX, resizeY,rotateDeg,stroke);
  }, [resizeWidth, resizeHeight, resizeX, resizeY,rotateDeg,stroke]);
  useEffect(()=>{
    onChangeZIndex(zIndex)
  },[zIndex])

  return (
    <div
      className="editor-node"
      style={{
        zIndex:zIndex,
        left: x,
        top: y,
        width,
        height,
        transform: `rotate(${rotateDeg}deg)`,
        transformOrigin:type=='line'?`${chart.stroke.transformOrigin}`:`center`
      }}
      ref={ref}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setShowSelector(true)}
      onMouseLeave={() => setShowSelector(false)}
      onContextMenu={handleContextMenu}
    >
      {((isSelected || showSelector)&&notLine) && renderNodeSelector}
      {isSelected && renderResize}
      {React.cloneElement(children as React.ReactElement<any>, {
        ref: containerRef
      })}
    </div>
  );
});
// node组件结束

export default Node;
