/**
 * @file 处理画布内的操作
 */

import * as React from "react";
import * as _ from "lodash";
import * as uuid from "uuid";
import { ReScreen, BaseLayout } from "../../regraph";
import { ZoomTransform, zoomIdentity } from "d3-zoom";
import { Menu } from "antd";
import { EditorNode } from "./EditorNode";
import { EditorGroup } from "./EditorGroup";
import { EditorEdges } from "./EditorEdges";
import { ContextMenu } from "./ContextMenu";
import {
  MenuPos,
  CONNECTOR,
  OperateType,
  Link,
  Node,
  Group,
  NODE_WIDTH,
  NODE_HEIGHT,
  LINK_AREA,
  Stroke,
} from "../constants/defines";
import {
  findUpstreamNode,
  findAllUpstreamNodes,
  findDownstreamNode,
  findAllDownstreamNodes,
  findAllDownstreamLinks,
  findNearbyNode
} from "../utils/find";
import { calcLinkPosition,getRotateAngle } from "../utils/calc";
import { pointInPoly, checkNodeIsOverGroup } from "../utils/layout";
import { getParent,addChildAt } from "../utils/dom";
import { exitFullscreen, launchFullscreen, isFull, getOffset } from "./utils";
import { CanvasContentProps, CanvasContentState } from '../constants/cavasTypes'
import {Point} from "../utils/types";

const {useEffect}=React



export default class CanvasContent extends React.Component<
  CanvasContentProps,
  CanvasContentState
> {
  nodesContainerRef: any;
  container: any;
  svgContainer: any;
  screenWidth?: number;
  screenHeight?: number;

  handleApplyTransform?: (transform: ZoomTransform) => void;
  handleResize?: (isLarge: boolean) => void;
  handleAdapt?: () => void;
  handleResizeTo?: (scale: number, P0?: [number, number]) => void;
  handleScreenResizeTo?: (scale: number, P0?: [number, number]) => void;
  handleLocation?: (point:Point) => void;
  editableRef:any;



  constructor(props) {
    super(props);
    this.state = {
      isDraggingNode: false,
      isDraggingLink: false,
      isDraggingGroup: false,
      isDraggingRotate:false,
      dragNode: null,
      dragLink: null,
      dragGroup: null,
      dragRotate:null,
      dragNodeOffset: null,
      dragGroupOffset: null,
      menuDisplay: false,
      textCompTxt:false,
      menuPos: {
        id: "",
        x: 0,
        y: 0
      },
      screenScale: 100,
      sourcePos: "",
      currentHoverNode: "",
      deleteVisible: false,
      currentSelectedNode: null
    };
    this.nodesContainerRef = React.createRef();
    this.container = React.createRef();
    this.svgContainer = React.createRef();
    this.editableRef = React.createRef()

  }

  componentDidMount() {
    this.nodesContainerRef.current.addEventListener(
      "mousedown",
      this.onNodesContainerMouseDown
    );
    this.container.current.addEventListener(
      "contextmenu",
      this.openContainerMenu
    );
    this.container.current.addEventListener("click", this.onContainerMouseDown);
    // 已经修改为text组件自己实现编辑，后期代码可能会去掉
    // this.nodesContainerRef.current.addEventListener("dblclick",this.onNodesContainerDbCLick)

    // 初始化布局
    this.handleApplyTransform(zoomIdentity);

  }

  componentWillUnmount() {
    this.nodesContainerRef.current.removeEventListener(
      "mousedown",
      this.onNodesContainerMouseDown
    );
    this.container.current.removeEventListener(
      "contextmenu",
      this.openContainerMenu
    );
    this.container.current.removeEventListener(
      "click",
      this.onContainerMouseDown
    );
    this.nodesContainerRef.current.removeEventListener("dblclick",this.onNodesContainerDbCLick)

  }

  componentWillUpdate(
    nextProps: CanvasContentProps,
    nextState: CanvasContentState
  ) {
    if (this.state.isDraggingNode !== nextState.isDraggingNode) {
      this.toggleDragNode(nextState.isDraggingNode);
    }
    if (this.state.isDraggingLink !== nextState.isDraggingLink) {
      this.toggleDragLink(nextState.isDraggingLink);
    }
    if (this.state.isDraggingGroup !== nextState.isDraggingGroup) {
      this.toggleDragGroup(nextState.isDraggingGroup);
    }
    if (nextProps.groups !== this.props.groups) {
      this.forceUpdate();
    }
    if(this.state.isDraggingRotate!==nextState.isDraggingRotate){
      this.toggleDragRoate(nextState.isDraggingRotate)
    }
  }

  /** 打开全局操作菜单，包括复制，粘贴，删除等 */
  openContainerMenu = (event: any) => {
    event.preventDefault();
  };

  toggleDragGroup = (isDraggingGroup: Boolean) => {
    if (isDraggingGroup) {
      window.addEventListener("mousemove", this.onDragGroupMouseMove);
      window.addEventListener("mouseup", this.onDragGroupMouseUp);
    } else {
      window.removeEventListener("mousemove", this.onDragGroupMouseMove);
      window.removeEventListener("mouseup", this.onDragGroupMouseUp);
    }
  };

  toggleDragNode = (isDraggingNode: Boolean) => {
    if (isDraggingNode) {
      window.addEventListener("mousemove", this.onDragNodeMouseMove);
      window.addEventListener("mouseup", this.onDragNodeMouseUp);
    } else {
      window.removeEventListener("mousemove", this.onDragNodeMouseMove);
      window.removeEventListener("mouseup", this.onDragNodeMouseUp);
    }
  };

  toggleDragLink = (isDraggingLink: Boolean) => {
    if (isDraggingLink) {
      window.addEventListener("mousemove", this.onDragLinkMouseMove);
      window.addEventListener("mouseup", this.onDragLinkMouseUp);
    } else {
      window.removeEventListener("mousemove", this.onDragLinkMouseMove);
      window.removeEventListener("mouseup", this.onDragLinkMouseUp);
    }
  };
  toggleDragRoate = (isDraggingRotate: Boolean) => {
    if (isDraggingRotate) {
      window.addEventListener("mousemove", this.onDragRotateMouseMove);
      window.addEventListener("mouseup", this.onDragRotateMouseUp);
    } else {
      window.removeEventListener("mousemove", this.onDragRotateMouseMove);
      window.removeEventListener("mouseup", this.onDragRotateMouseUp);
    }
  };

  onDragLinkMouseMove = (event: any) => {
    event.stopPropagation();
    event.preventDefault();

    const { offsetTop, offsetLeft } = getOffset(this.container.current);
    // 计算滚动条的位置
    const scrollLeft =
      document.documentElement.scrollLeft +
      document.querySelector("#root").scrollLeft;
    const scrollTop =
      document.documentElement.scrollTop +
      document.querySelector("#root").scrollTop;

    const screenX = event.clientX - offsetLeft + scrollLeft;
    const screenY = event.clientY - offsetTop + scrollTop;

    const { k, x, y } = this.props.currTrans;

    this.setState(preState => {
      const { dragLink } = preState;
      return {
        dragLink: {
          ...dragLink,
          x: (screenX - x) / k,
          y: (screenY - y) / k
        }
      };
    });
  };
  // resize结束
  resizeMouseUp = ()=>{
    const {onSaveHistory}=this.props
    onSaveHistory()
  }
  // 监听整个区域的双击事件
  onNodesContainerDbCLick = (event: any)=>{
    const nd=this.state.currentSelectedNode
    if(nd&&nd.key=='text'){
      // 创建一个可编辑的div
      // const textEdittable=document.createElement("div");
      // textEdittable.style.width = nd.width+"px"
      // textEdittable.style.height = nd.height+"px"
      // textEdittable.style.backgroundColor = "#fff"
      // textEdittable.style.position = "absolute"
      // textEdittable.style.left = nd.x+"px"
      // textEdittable.style.top = nd.y+"px"
      // textEdittable.style.overflow="hidden"
      // textEdittable.style.textOverflow="hidden"
      // textEdittable.style.whiteSpace="nowrap"
      // textEdittable.style.zIndex=nd.zIndex+""
      // textEdittable.style.transform=`rotate(${nd.rotate}deg)`
      // textEdittable.innerText=nd.name
      // textEdittable.setAttribute("class","editor-node")
      // textEdittable.setAttribute("contenteditable","true")
      // const p = getParent(this.nodesContainerRef.current,"div")
      // addChildAt(p,textEdittable,1000);
      this.setState({textCompTxt:true})

    }
  }


  /** 监听整个区域，提升性能 */
  onNodesContainerMouseDown = (event: any) => {
    event.stopPropagation();
    //event.preventDefault()
    const { nodes, groups,setSelectedGroup } = this.props;
    // 如果画布中有节点
    if (nodes && nodes.length > 0) {
      const currentNode = _.find(nodes, c => {
        if (c.ref && c.ref.current) {
          return c.ref.current.contains(event.target);
        }
        return false;
      });
      const type = event.target.dataset && event.target.dataset.type;
      const position = event.target.dataset && event.target.dataset.position;
      // 如果当前选中的是节点
      if (currentNode) {
        if (type === "edge" && position) {
          /** 拖拽连线 */
          this.onDragLinkMouseDown(currentNode as any, position);
          return;
        } else if (type === "resize") {
          event.target.removeEventListener("mouseup",this.resizeMouseUp)
          event.target.addEventListener("mouseup",this.resizeMouseUp)
          return;
        }else if(type === "rotate" && position){
          /**旋转图形**/
          this.onDragRotateMouseDown(currentNode as any, 'top')
        } else {
          /** 拖拽节点，排除resize节点 */
          this.onDragNodeMouseDown(currentNode as any, event);
        }
      }
    }
    // 如果当前选中的是组
    if (groups && groups.length > 0) {
      const currentGroup = _.find(groups, c => {
        if (c.ref && c.ref.current) {
          return c.ref.current.contains(event.target);
        }
        return false;
      });
      this.onDragGroupMouseDown(currentGroup as any, event);
    }else{
      setSelectedGroup(undefined)
    }
  };

  /** 监听整个容器click事件 */
  onContainerMouseDown = (event: any) => {
    // event.preventDefault()
    // event.stopPropagation();
    // 过滤掉节点和边
    const path = event.path;
    const isNodeOrLink = this.hasNodeOrLink(path, "editor-node", "editor-link");
    if (!isNodeOrLink) {
      // 清空高亮的节点和边
      this.handleClearActive();
    }else{

    }
  };

  /** 监听整个容器mousemove 事件 */
  onNodesContainerMouseMove = (event: any) => {
    event.preventDefault();
    const path = event.path;
    const isNodeOrLink = this.hasNodeOrLink(path, "editor-node", "editor-link");
    const { nodes } = this.props;

    if (nodes && nodes.length > 0) {
      const currentNode = _.find(nodes, c => {
        if (c.ref && c.ref.current) {
          return c.ref.current.contains(event.target);
        }
        return false;
      }) as Node;

      if (currentNode) {
        if (isNodeOrLink) {
          this.setState({
            currentHoverNode: currentNode.id
          });
        } else {
          this.setState({
            currentHoverNode: ""
          });
        }
      }
    }
  };

  /** 鼠标按下，进行连线 */
  onDragLinkMouseDown = (node: Node, position: string) => {
    const { x, y } = calcLinkPosition(node, position);
    this.setState({
      isDraggingLink: true,
      dragLink: {
        originId: node.id,
        originX: x,
        originY: y,
        x,
        y
      },
      sourcePos: position
    });
  };

  /** 鼠标抬起，连线结束 */
  onDragLinkMouseUp = (event: any) => {
    const { setLinks, links, nodes,onSaveHistory } = this.props;
    const { dragLink } = this.state;
    const { offsetTop, offsetLeft } = getOffset(this.container.current);

    // 计算滚动条的位置
    const scrollLeft =
      document.documentElement.scrollLeft +
      document.querySelector("#root").scrollLeft;
    const scrollTop =
      document.documentElement.scrollTop +
      document.querySelector("#root").scrollTop;

    const screenX = event.clientX - offsetLeft + scrollLeft;
    const screenY = event.clientY - offsetTop + scrollTop;

    const { k, x, y } = this.props.currTrans;

    const nearNode = findNearbyNode(
      {
        x: (screenX - x) / k,
        y: (screenY - y) / k
      },
      nodes,
      LINK_AREA
    );

    // 需要找到链接的是哪个节点

    if (nearNode) {
      const { targetNode, targetPos } = nearNode;
      const newLink = {
        id:
          dragLink.originId + CONNECTOR + targetNode.id + CONNECTOR + targetPos,
        source: dragLink.originId,
        target: targetNode.id,
        sourcePos: this.state.sourcePos,
        targetPos
      };
      setLinks([...links, newLink]);
    }

    this.setState({
      isDraggingLink: false,
      dragLink: null,
      sourcePos: ""
    });
    onSaveHistory()

  };

  /** 鼠标按下，进行旋转 */
  onDragRotateMouseDown = (node: Node, position: string) => {
    const { x, y } = calcLinkPosition(node, position);
    const cx = node&&(node.x+Math.round(node.width/2))
    const cy = node&&(node.y+Math.round(node.height/2))
    this.setState({
      isDraggingRotate: true,
      dragRotate: {
        originId: node.id,
        center: [cx,cy],
        first: [x,y],
        second:[0,0]
      },
      sourcePos: position
    });
  }
  /** 监听鼠标旋转图形 */
  onDragRotateMouseMove = (event: any) => {
    event.stopPropagation();
    event.preventDefault();

    const { offsetTop, offsetLeft } = getOffset(this.container.current);
    // 计算滚动条的位置
    const scrollLeft =
        document.documentElement.scrollLeft +
        document.querySelector("#root").scrollLeft;
    const scrollTop =
        document.documentElement.scrollTop +
        document.querySelector("#root").scrollTop;

    const screenX = event.clientX - offsetLeft + scrollLeft;
    const screenY = event.clientY - offsetTop + scrollTop;

    const { k, x, y } = this.props.currTrans;

    this.setState(preState => {
      const { dragRotate } = preState;
      return {
        dragRotate: {
          ...dragRotate,
          second: [(screenX - x) / k,(screenY - y) / k]
        }
      };
    });
    const rotateAngle = getRotateAngle(this.state.dragRotate.center,this.state.dragRotate.first,this.state.dragRotate.second);
    let deg = rotateAngle/Math.PI*180
    if(isNaN(deg)){
      return;
    }
    deg=Math.round(deg)
    const {updateNodes,nodes}=this.props
    this.state.dragNode.rotate=deg;
    this.setState({
      dragNode:{
          ...this.state.dragNode,
      }
    })
    updateNodes(this.state.dragNode)
  }
  /** 鼠标抬起，旋转结束 */
  onDragRotateMouseUp = (event: any) => {
    const {onSaveHistory}=this.props
    this.setState({
      isDraggingRotate: false,
      dragRotate: null,
      sourcePos: ""
    });
    onSaveHistory()
  }

  /** 处理节点与组的关系 */
  handleNodeIsOverGroup = (currentGroup: Group, dragNode: Node) => {
    const { updateNodes, updateGroups } = this.props;

    if (checkNodeIsOverGroup(dragNode, currentGroup, "leave") === "out") {
      // 该节点是否在组外
      updateNodes({ ...dragNode, groupId: "" });
      const newNodes = currentGroup.nodes.filter(
        node => node.id !== dragNode.id
      );
      // 更新组，重新计算组的宽度
      updateGroups(newNodes, dragNode.groupId);
    } else {
      //// // console.log("leave in");
      // 改变组的大小
      const newNodes = currentGroup.nodes.map(node =>
        node.id === dragNode.id ? dragNode : node
      );
      updateGroups(newNodes);
    }
  };

  /** 按下节点 */
  onDragNodeMouseDown = (node: Node, event: any) => {
    console.log("currentSelectedNode==",node)
    this.setState({currentSelectedNode: node})
    if (node) {
      const { k, x, y } = this.props.currTrans;

      const { offsetTop, offsetLeft } = getOffset(this.container.current);
      const screenX = event.clientX - offsetLeft;
      const screenY = event.clientY - offsetTop;
      this.setState(preState => {
        // 计算鼠标位置在节点中的偏移量
        return {
          isDraggingNode: true,
          dragNode: node,
          dragNodeOffset: {
            x: (screenX - x) / k - node.x,
            y: (screenY - y) / k - node.y
          }
        };
      });
    }
  };

  /** 移动节点 */
  onDragNodeMouseMove = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    const { setNodes, nodes,selectedNodes } = this.props;

    const { k, x, y } = this.props.currTrans;

    const { offsetTop, offsetLeft } = getOffset(this.container.current);
    const screenX = event.clientX - offsetLeft;
    const screenY = event.clientY - offsetTop;
    // 判断当前节点平移后是否溢出画布
    // const isOver = this.checkNodeIsOverScreen(dragNode, screenX, screenY);

    // if (!isOver) {
    this.setState(preState => {
      const { dragNode, dragNodeOffset } = preState;

      const newX = (screenX - x) / k - dragNodeOffset.x;
      const newY = (screenY - y) / k - dragNodeOffset.y;

      return {
        ...preState,
        dragNode: {
          ...dragNode,
          x: newX,
          y: newY
        }
      };
    });

    const { dragNodeOffset, dragNode } = this.state;

    setNodes(
      nodes.map(c => {
        return c.id === dragNode.id
          ? {
              ...c,
              x: (screenX - x) / k - dragNodeOffset.x,
              y: (screenY - y) / k - dragNodeOffset.y
            }
          : c;
      })
    );
  };

  /** 放开节点 */
  onDragNodeMouseUp = (event: any) => {
    event.stopPropagation();
    const { groups, updateNodes, updateGroups,onSaveHistory } = this.props;

    const { dragNode } = this.state;
    // 通过是否有groupId来区分是从组中脱离还是拖入组中
    if (groups) {
      groups.forEach(group => {
        const { nodes } = group;

        // 判断根据拖拽的节点有无groupId来属于enter还是leave
        const groupId = dragNode?.groupId;
        if (groupId) {
          // 拖出
          this.handleNodeIsOverGroup(group, dragNode);
        } else {
          // 考虑是否在组内
          if (checkNodeIsOverGroup(dragNode, group, "enter") === "in") {
            const newNodes = [...nodes, dragNode];
            // 更新组，重新计算组的宽度
            updateGroups(newNodes);
          } else {
            updateGroups(nodes);
          }
        }
      });
    }

    this.setState({
      isDraggingNode: false
    });

   onSaveHistory()
  };

  /** 按下组 */
  onDragGroupMouseDown = (group: Group, event: any) => {
    if (group) {
      const {setSelectedGroup} = this.props
      setSelectedGroup(group);
      const { k, x, y } = this.props.currTrans;

      const { offsetTop, offsetLeft } = getOffset(this.container.current);
      const screenX = event.clientX - offsetLeft;
      const screenY = event.clientY - offsetTop;
      this.setState(preState => {
        // 计算鼠标位置在节点中的偏移量
        return {
          isDraggingGroup: true,
          dragGroup: group,
          dragGroupOffset: {
            x: (screenX - x) / k - group.x,
            y: (screenY - y) / k - group.y
          }
        };
      });
    }
  };

  /** 移动组 */
  onDragGroupMouseMove = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    const { setGroups, groups, nodes, setNodes } = this.props;

    const { k, x, y } = this.props.currTrans;

    const { offsetTop, offsetLeft } = getOffset(this.container.current);
    const screenX = event.clientX - offsetLeft;
    const screenY = event.clientY - offsetTop;
    let diffX = 0;
    let diffY = 0;

    this.setState(preState => {
      const { dragGroup, dragGroupOffset } = preState;

      const newX = (screenX - x) / k - dragGroupOffset.x;
      const newY = (screenY - y) / k - dragGroupOffset.y;

      diffX = dragGroup.x - newX;
      diffY = dragGroup.y - newY;

      return {
        ...preState,
        dragGroup: {
          ...dragGroup,
          x: newX,
          y: newY
        }
      };
    });

    const { dragGroupOffset, dragGroup } = this.state;

    const newGroups = groups.map(c => {
      if (c.id === dragGroup.id) {
        const nodes = c.nodes;
        return {
          ...c,
          x: (screenX - x) / k - dragGroupOffset.x,
          y: (screenY - y) / k - dragGroupOffset.y,
          // 更新节点
          nodes: nodes.map(node => {
            return {
              ...node,
              x: node.x - diffX,
              y: node.y - diffY
            };
          })
        };
      } else {
        return c;
      }
    });
    // 同时更新nodes

    const newNodes = nodes.map(node => {
      if (node.groupId === dragGroup.id) {
        return {
          ...node,
          x: node.x - diffX,
          y: node.y - diffY
        };
      } else {
        return node;
      }
    });
    setNodes(newNodes);
    setGroups(newGroups);
  };

  /** 放开组 */
  onDragGroupMouseUp = (event: any) => {
    event.stopPropagation();
    const { groups, updateNodes, updateGroups,onSaveHistory } = this.props;

    const { dragGroup } = this.state;

    this.setState({
      isDraggingGroup: false,
      dragGroup: null,
      dragGroupOffset: null
    });
    onSaveHistory()
  };
  // 获得画布缩放移动信息
  getTransformInfo = (currTrans: ZoomTransform) => {
    this.props.setCurrTrans(currTrans);
  };

  getScreenHandler = handleMap => {
    this.handleApplyTransform = handleMap.handleApplyTransform;
    this.handleResize = handleMap.handleResize;
    // 覆盖掉原来的resize操作，改成resize父容器，container
    this.handleResizeTo = handleMap.handleResizeTo;
    this.handleScreenResizeTo = handleMap.handleScreenResizeTo;
    this.handleAdapt = handleMap.handleAdapt;
    this.screenWidth = handleMap.screenWidth;
    this.screenHeight = handleMap.screenHeight;
    this.handleLocation = handleMap.handleLocation
  };

  onDrag(event, name: string) {}

  // 添加节点到画布
  onDrop(event: React.DragEvent<HTMLDivElement>) {
    const { setNodes, nodes, dragNode,onSaveHistory } = this.props;
    const { offsetTop, offsetLeft } = getOffset(this.container.current);
    // 计算滚动条的位置
    const scrollLeft =
      document.documentElement.scrollLeft +
      document.querySelector("#root").scrollLeft;
    const scrollTop =
      document.documentElement.scrollTop +
      document.querySelector("#root").scrollTop;

    const screenX = event.clientX - offsetLeft + scrollLeft;
    const screenY = event.clientY - offsetTop + scrollTop;

    const { k, x, y } = this.props.currTrans;

    if (dragNode) {
      // 新添加了chart属性
      const { key, name, type, width, height,chart,zIndex,style,rotate,url } = dragNode;
      console.log(style)

      const newNode = {
        key,
        name,
        type,
        width,
        height,
        chart,
        zIndex,
        style,
        rotate,
        url,
        x: (screenX - x) / k - NODE_WIDTH / 2,
        y: (screenY - y) / k - NODE_HEIGHT / 2,
        id: uuid.v4(),
        ref: React.createRef()
      };
      setNodes([...nodes, newNode]);
      nodes.push(newNode)
      onSaveHistory()
    }

  }

  /** 清空高亮组件和连线 */
  handleClearActive = () => {
    this.props.setSelectedLinks([]);
    this.props.setSelectedNodes([]);
  };

  /** 判断点击的节点是否为节点和边 */
  hasNodeOrLink = (array: any[], node?: string, link?: string) => {
    let isNodeOrLink = false;
    if(array==undefined) return isNodeOrLink;
    for (let i = 0; i < array.length; i++) {
      const inNode = _.includes(array[i].classList, node);
      const inLink = _.includes(array[i].classList, link);



      if (inNode || inLink) {
        isNodeOrLink = true;
        // console.log(node,link)
        // console.log(this.state.currentHoverNode)

        break;
      }
    }
    return isNodeOrLink;
  };

  /** 改变缩放倍率 */
  changeScreenScale = (screenScale: number) => {
    this.setState({
      screenScale
    });
  };

  /** 处理全屏事件 */
  handleFullScreen = () => {
    const fullScreen = isFull();
    if (fullScreen) {
      exitFullscreen();
    } else {
      launchFullscreen(this.container.current);
    }
  };

  /** 适应画布 */
  handleShowAll = () => {
    const { nodes } = this.props;

    if (nodes && nodes.length === 0) {
      return;
    }

    // 组件实际范围
    const minX = _.minBy(nodes, c => c.x).x;
    const maxX = _.maxBy(nodes, c => c.x)?.x + _.maxBy(nodes, c => c.x)?.width;
    const minY = _.minBy(nodes, c => c.y).y;
    const maxY = _.maxBy(nodes, c => c.y)?.y + _.maxBy(nodes, c => c.y)?.height;

    const componentWidth = maxX - minX;
    const componentHeight = maxY - minY;

    // 先在不缩放的场景下，平移到画布中点
    const x = this.screenWidth / 2 - (minX + maxX) / 2;
    const y = this.screenHeight / 2 - (minY + maxY) / 2;
    const transform = zoomIdentity.translate(x, y).scale(1);
    // // console.log("transform=",transform)
    // 适应画布最大100%，保证在节点少的情况下不发生放大
    const scale = Math.min(
      this.screenWidth / componentWidth,
      this.screenHeight / componentHeight,
      1
    );
    // Todo 待收敛到 ReScreen
    const P0 = [this.screenWidth / 2, this.screenHeight / 2] as [
      number,
      number
    ];
    const P1 = transform.invert(P0);
    const newTransform = zoomIdentity
      .translate(P0[0] - P1[0] * scale, P0[1] - P1[1] * scale)
      .scale(scale);
    this.handleApplyTransform(newTransform);
  };

  /** 格式化画布 */
  layout = () => {
    const { nodes, links, setNodes } = this.props;
    if (nodes && nodes.length === 0) {
      return {
        nodes,
        screen: {
          k: 1,
          x: 0,
          y: 0
        }
      };
    }

    const datas = nodes.map(component => {
      // 兼容 BaseLayout 数据结构
      (component as any).nodeWidth = component.width;
      (component as any).nodeHeight = component.height;
      const downRelations = links
        .filter(link => {
          return link.target === component.id;
        })
        .map(link => {
          return {
            sourceId: link.source,
            targetId: link.target
          };
        });
      const upRelations = links
        .filter(link => {
          return link.source === component.id;
        })
        .map(link => {
          return {
            sourceId: link.source,
            targetId: link.target
          };
        });
      return {
        id: component.id,
        downRelations,
        upRelations
      };
    });

    const maxWidth = _.maxBy(nodes, item => item.width)?.width;
    const maxHeight = _.maxBy(nodes, item => item.height)?.height;

    const dag = new BaseLayout.DAG({
      isTransverse: true,
      padding: 20,
      margin: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      defaultNodeWidth: maxWidth,
      defaultNodeHeight: maxHeight
    });

    const { nodes: newNodes } = dag.getMultiDAG(datas);

    const layoutNodes = nodes.map(component => {
      const node = _.find(newNodes, n => n.id === component.id);
      return {
        ...component,
        x: node.view.x,
        y: node.view.y
      };
    });
    setNodes(layoutNodes);
  }
  /********layout结束********/
  /** 点击连线 */
  onSelectLink = (key: string) => {
    const { selectedLinks, setSelectedLinks } = this.props;
    if (selectedLinks) {
      // 若连线已高线，则取消高亮状态
      const index = _.findIndex(selectedLinks, link => link === key);
      if (index > -1) {
        setSelectedLinks([
          ...selectedLinks.slice(0, index),
          ...selectedLinks.slice(index + 1)
        ]);
      } else {
        setSelectedLinks([...selectedLinks, key]);
      }
    } else {
      setSelectedLinks([key]);
    }
  };

  /** 点击节点 */
  onClickNode = (currentNode: Node) => {
    const {
      selectedNodes,
      setSelectedNodes,
      setSelectedLinks,
      isKeyPressing
    } = this.props;

    // 区分多选按钮是否按下
    if (isKeyPressing) {
      if (selectedNodes) {
        // 若节点已被点击则清除点击状态
        const index = _.findIndex(selectedNodes, id => id === currentNode.id);

        if (index > -1) {
          setSelectedNodes([
            ...selectedNodes.slice(0, index),
            ...selectedNodes.slice(index + 1)
          ]);
        } else {
          setSelectedNodes(_.compact([...selectedNodes, currentNode.id]));
        }
      } else {
        setSelectedNodes([currentNode.id]);
      }
    } else {
      setSelectedNodes([currentNode.id]);
      // 清空高亮的连线
      setSelectedLinks(null);
    }
  };

  /** 被连线的节点 */
  onSelectNode = (currentNode: Node, key: OperateType) => {
    this.setState({currentSelectedNode: currentNode})
    const { selectedNodes, deleteNodes } = this.props;
    if (key === OperateType.delete) {
      // 删除组件以及删除连线
      // 判断改节点是否在多选区域内
      // // console.log("currentNode==",currentNode)
      if (selectedNodes && selectedNodes.includes(currentNode.id)) {
        deleteNodes(_.compact([...selectedNodes, currentNode.id]));
      } else {
        deleteNodes([currentNode.id]);
      }
    }
  };

  /** 右键连线 */
  onContextMenuLink = (
    key: string,
    event: React.MouseEvent<SVGPathElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.setSelectedLinks([key]);
    // 清空高亮的组件
    this.props.setSelectedNodes(null);

    const currentPos = {
      x: event.clientX,
      y: event.clientY
    };
    this.setState({
      deleteVisible: true,
      menuPos: currentPos
    });
  };

  /** 伸缩节点 */
  onResize = (
    node: Node,
    width: number,
    height: number,
    x: number,
    y: number,
    lineRotate: number,
    stroke:Stroke
  ) => {
    const { updateNodes } = this.props;
    const newNode = {
      ...node,
      width,
      height,
      x,
      y,
      rotate:lineRotate
    };
    // 将直线改变的坐标更新上去
    if(newNode.chart?.stroke){
      newNode.chart.stroke = stroke
    }
    updateNodes(newNode);
  };
  onChangeZIndex = (node:Node,zIndex:number)=>{
    const { updateNodes } = this.props;
    const newNode = {
      ...node,
      zIndex
    };
    updateNodes(newNode);
  }
  // 渲染可编辑文本框
  renderEditableText=()=>{
    const node = this.state.currentSelectedNode;
    if(this.state.textCompTxt&&this.state.currentSelectedNode){
      return (
          <div suppressContentEditableWarning  className="editor-node" style={{
            width:node.width,
            height:node.height,
            top:node.y,
            left:node.x,
            backgroundColor: '#fff',
            display:this.state.textCompTxt?'block':'none'
          }} contentEditable="true" ref={this.editableRef}>{node.name}</div>
      )
    }else{
      return <span  ref={this.editableRef}></span>
    }
  }
  // 渲染节点内容
  renderCanvas = () => {
    const { currentHoverNode } = this.state;
    const { nodes,links, selectedNodes, selectedLinks, groups } = this.props;
    return (
      <div className="editor-view">
        <div className="editor-view-content" ref={this.nodesContainerRef}>
          {(nodes || []).map(child => {
            const id = child?.id;
            const isSelected = selectedNodes
              ? selectedNodes.includes(id)
              : false;
            const showSelector = isSelected || currentHoverNode === id;
            return (
              <EditorNode
                nodeRef={child.ref}
                currentNode={child}
                key={id}
                onClick={this.onClickNode}
                isSelected={isSelected}
                showSelector={showSelector}
                onResize={this.onResize.bind(this, child)}
                onChangeZIndex={this.onChangeZIndex.bind(this,child)}
                currTrans={this.props.currTrans}
                onSelect={this.onSelectNode}
                updateNodes={this.props.updateNodes}
              />
            );
          })}

          {(groups || []).map(child => {
            const id = child?.id;
            const nodesInGroup = child?.nodes;
            return (
              <EditorGroup
                key={id}
                id={id}
                groupRef={child?.ref}
                currentGroup={child}
                nodes={nodesInGroup}
              />
            );
          })}

          <EditorEdges
            links={links}
            nodes={nodes}
            selectedLinks={selectedLinks}
            onContextMenu={this.onContextMenuLink}
            onSelectLink={this.onSelectLink}
            isDraggingLink={this.state.isDraggingLink}
            isDraggingRotate={this.state.isDraggingRotate}
            dragLink={this.state.dragLink}
          />
        </div>
      </div>
    );
  };


  render() {
    const { deleteVisible, menuPos } = this.state;
    const {canvasStyle}=this.props;
    return (
        <div className="canvas-container-content" ref={this.container}>
          <svg className="svg-caves" ref={this.svgContainer}></svg>
          <ReScreen
              type="DOM"
              getScreenHandler={this.getScreenHandler}
              needMinimap={false}
              needRefresh={true}
              zoomEnabled={false}
              svgContainer={this.svgContainer}
              dragDirection="NONE"
              mapPosition="RT-IN"
              mapWidth={200}
              mapHeight={300}
              height={canvasStyle.height}
              width={canvasStyle.width}
              screenHeight={canvasStyle.height}
              screenWidth={canvasStyle.width}
              backgroundColor={canvasStyle.backgroundColor}
              backgroundImage={canvasStyle.backgroundImage}
              grid={canvasStyle.grid}
              mapRectStyle={{
                stroke: "#468CFF",
                fill: "transparent",
                strokeWidth: 1.5
              }}
              focusEnabled={2}
              onScreenChange={this.getTransformInfo}
              onDragOver={event => {
                event.preventDefault();
              }}
              onDrop={this.onDrop.bind(this)}
          >
            {this.renderCanvas()}
          </ReScreen>
          {/** 删除连线的菜单 */}
          <ContextMenu
              visible={deleteVisible}
              // onHide={() => {
              //   this.props.setLinks(null);
              //   this.setState({
              //     deleteVisible: false
              //   });
              // }}
              left={menuPos.x}
              top={menuPos.y}
              // onClick={this.handleDeleteLinks.bind(this, selectedLinks)}
          >
            <Menu
                getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
            >
              {[
                {
                  name: "删除",
                  key: OperateType.delete
                }
              ].map(child => {
                return <Menu.Item key={child.key}>{child.name}</Menu.Item>;
              })}
            </Menu>
          </ContextMenu>
        </div>
    );
  }
}
