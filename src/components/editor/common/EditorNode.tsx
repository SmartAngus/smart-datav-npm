/**
 * @file 业务组件，基于Node的组件卡片
 * @author perkinJ
 */

import * as React from "react";
import classNames from "classnames";
import { Menu } from "antd";
import { Node as NodeContainer } from "../components";
import { ContextMenu } from "./ContextMenu";
import {Node, OperateType, Stroke} from "../constants/defines";
import { useClickAway } from "../hooks/useClickAway";
import "./EditorNode.scss";


import CapsuleChart from '../components/charts/capsuleChart'
import CircleComp from '../components/charts/circleComp'
import LineComp from '../components/charts/lineComp'
import TextComp from '../components/charts/textComp'
import TimeComp from '../components/charts/timeComp'
import ImageComp from '../components/charts/imageComp'

const { useState, useRef, useMemo, useCallback } = React;


class EditorNodeProps {
  /** 唯一id，用于Contextmenu展示 */
  id?: string;

  /** 节点信息 */
  currentNode: Node;

  /** 选择菜单栏 */
  onSelect?: (currentNode: Node, key: any) => void;

  /** 右键组件 */
  onContextMenu?: (event: React.MouseEvent<HTMLLIElement>) => void;

  /** 是否属性设置完全 */
  isCompleted?: boolean;

  /** 是否有错误数据 */
  hasError?: boolean;

  /** 是否被点击 */
  isSelected?: boolean;

  /** 是否被拖拽 */
  isDragged?: boolean;

  /** 点击卡片 */
  onClick?: (currentNode: Node, event: any) => void;

  /** 是否可交互，区分展示型和交互型 */
  interactive?: boolean;

  /** 外部容器的缩放情况 */
  currTrans?: any;

  /** 显示选择器 */
  showSelector?: boolean;

  /** Node容器的ref */
  nodeRef: any;

  /** 改变节点大小 */
  onResize?: (width: number, height: number, x: number, y: number,rotate:number,stroke:Stroke) => void;
  /** 改变节点图层 */
  onChangeZIndex?:(zIndex: number)=>void;
  updateNodes?:(node:Node)=>void;
  isShiftKey?:boolean
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

export function EditorNode(props: EditorNodeProps) {
  const {
    currentNode,
    onSelect,
    isSelected,
    isDragged,
    onClick,
    interactive = true,
    currTrans,
    nodeRef,
    onResize,
    onChangeZIndex,
    updateNodes,
    isShiftKey
  } = props;
  // 组件内状态，与业务无关
  const [menuShow, setMenuShow] = useState(false);
  const [menuPos, setMenuPos] = useState({ left: 0, top: 0 });
  const [editableShow,setEditableShow]=useState(false)

  useClickAway(
    () => {
      setMenuShow(false);
    },
    () => document.querySelector(".editorNode-box-menu"),
    "contextmenu"
  );





  const menuRef = useClickAway(() => {
    setMenuShow(false);
  });
  const editableRef = useClickAway(() => {
    setEditableShow(false)
  });

  const editorNodeRef = useRef(null);

  // const [pos, setPos] = useState(initPos);
  // 边框颜色
  let borderColor = "";
  if (isSelected) {
    borderColor = `selected ${currentNode.key}-clicked ${
      currentNode.key
    }-border`;
  } else {
    borderColor = `${currentNode.key}-border`;
  }

  // 是否是圆形
  const isCircle = currentNode.key === "circle";

  // 是否为圆角
  const isRadius = currentNode.key === 'rectRadius';

  // 是否为菱形
  const isDiamond = currentNode.key === 'diamond';

  const borderClass = classNames(
    "editorNode-box",
    borderColor,
    {
      dragging: isDragged
    },
    { "editorNode-circle": isCircle },
    { "editorNode-rectRadius": isRadius},
  );

  const menuList = [
    {
      name: "删除",
      key: OperateType.delete,
      disabled: false
    }
  ];

  const onContextMenu = (
    position: { left: number; top: number },
    event: React.MouseEvent<any>
  ) => {
    event.stopPropagation();
    event.preventDefault();
    // 根据业务场景处理菜单的位置
    const newPosition = {
      left: position.left,
      top: position.top
    };
    setMenuPos(newPosition);
    setMenuShow(true);
    if (props.onContextMenu) {
      props.onContextMenu(event);
    }
  };
  const onContextEditable = (
    event: React.MouseEvent<any>
  ) => {
    event.stopPropagation();
    event.preventDefault();
    // 根据业务场景处理菜单的位置
    setEditableShow(true);
  };

  /** 点击菜单项 */
  const handleClickMenu = ({ key }) => {
    onSelect(currentNode, key);
    setMenuShow(false);
  };

  /** 点击组件 */
  const handleClickNode = useCallback(
    event => {
      if (interactive && onClick) {
        onClick(currentNode, event);
      }
    },
    [interactive, onClick, currentNode]
  );
    // 动态渲染组件
  // const newNode = _.cloneDeep(currentNode)
  // delete newNode.ref;
  const dynamicLoadComp=useMemo(()=>{
    if (currentNode.chart?.component=='TimeComp')
      return <TimeComp node={currentNode} updateNodes={updateNodes}></TimeComp>
    if (currentNode.chart?.component=='TextComp')
      return <TextComp node={currentNode} interactive={interactive} updateNodes={updateNodes}></TextComp>
    if (currentNode.chart?.component=='LineComp')
      return <LineComp node={currentNode} updateNodes={updateNodes}></LineComp>
    if (currentNode.chart?.component=='CircleComp')
      return <CircleComp node={currentNode} updateNodes={updateNodes}></CircleComp>
    if (currentNode.chart?.component=='CapsuleChart')
      return <CapsuleChart node={currentNode} updateNodes={updateNodes}></CapsuleChart>
    if (currentNode.type=='image')
      return <ImageComp node={currentNode} updateNodes={updateNodes}></ImageComp>
  },[currentNode.chart?.format,currentNode.chart?.stroke,currentNode.width])// 只有时间控件和直线才会重新加载

  return (
    <NodeContainer
      id={currentNode.id}
      x={currentNode.x}
      y={currentNode.y}
      width={currentNode.width}
      height={currentNode.height}
      chart={currentNode.chart}
      url={currentNode.url}
      style={currentNode.style}
      rotate={currentNode.rotate}
      zIndex={currentNode.zIndex}
      type = {currentNode.key}
      currTrans={currTrans}
      ref={nodeRef}
      isSelected={isSelected}
      interactive={interactive}
      onClick={interactive ? handleClickNode:null}
      onDoubleClick={interactive ? onContextEditable:null}
      onResize={interactive ? onResize:null}
      onChangeZIndex={interactive ? onChangeZIndex:null}
      onContextMenu={interactive ? onContextMenu : null}
      isShiftKey={isShiftKey}
    >
      {currentNode.chart==undefined&&currentNode.url==undefined?(
        <div className="editorNode" ref={editorNodeRef}>
          <div className={borderClass} style={ {
            ...currentNode.style,
            transform: isDiamond?`rotateZ(45deg) skew(30deg,30deg)`: 'none'
          }}>
            <div className="editorNode-box-property">
              <div className="editorNode-name">{/*{currentNode.name}*/}</div>
            </div>
            <div className="editorNode-box-menu" ref={menuRef}>
              <ContextMenu
                id={currentNode.id}
                visible={menuShow}
                left={menuPos.left}
                top={menuPos.top}
              >
                <Menu
                  getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                >
                  {menuList.map(child => {
                    return (
                      <Menu.Item key={child.key} onClick={handleClickMenu}>
                        {child.name}
                      </Menu.Item>
                    );
                  })}
                </Menu>
              </ContextMenu>
            </div>
          </div>
        </div>
      ):(
        <div style={{
          ...currentNode.style,
          display:'table',
          position:"relative",
          width:"100%",
          height:"100%"}}>
          {dynamicLoadComp}
          <div className="editorNode-box-menu" ref={menuRef}>
            <ContextMenu
              id={currentNode.id}
              visible={menuShow}
              left={menuPos.left}
              top={menuPos.top}
            >
              <Menu
                getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
              >
                {menuList.map(child => {
                  return (
                    <Menu.Item key={child.key} onClick={handleClickMenu}>
                      {child.name}
                    </Menu.Item>
                  );
                })}
              </Menu>
            </ContextMenu>
          </div>
        </div>
      )}
    </NodeContainer>
  );
}
