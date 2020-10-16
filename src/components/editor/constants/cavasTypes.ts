import {Group, Link, MenuPos, Node} from "./defines";
import {ZoomTransform} from "d3-zoom";

export class CanvasContentProps {
    ref: any;
    nodes: Node[];
    links: Link[];
    groups: Group[];
    setNodes: (nodes: Node[]) => void;
    setLinks: (links: Link[]) => void;
    setGroups?: (groups: Group[]) => void;
    selectedLinks: string[];
    setSelectedLinks: (links: string[]) => void;
    selectedNodes: string[];
    setSelectedNodes: (links: string[]) => void;
    setSelectedGroup?:(group:Group)=>void;
    selectedGroup?:Group;
    /** 当前拖拽的节点 */
    dragNode: Node;
    updateNodes: (node: Node) => void;
    onSaveHistory:()=>void;
    updateLinks: (link: Link) => void;
    updateGroups?: (nodes: Node[], deleteGroupId?: string) => void;
    deleteNodes: (selectedNodes: string[]) => void;
    deleteLinks: (selectedLinks: string[]) => void;
    copiedNodes: Node[];
    setCopiedNodes: (nodes: Node[]) => void;
    currTrans: ZoomTransform;
    setCurrTrans: (transform: ZoomTransform) => void;
    /** 是否被按住 */
    isKeyPressing: boolean;
    // 面板背景大小设置
    canvasStyle?:any;
    onEditNode?:(node:Node,nodes:Node[],group:Group[],links:Link[])=>void;
}

export class CanvasContentState {
    /** 拖拽节点 */
    isDraggingNode: boolean;
    /** 拖拽边 */
    isDraggingLink: boolean;
    /** 拖拽组 */
    isDraggingGroup: boolean;
    /** 拖拽旋转 */
    isDraggingRotate: boolean;
    /** 拖拽组 */
    dragGroup: Group;
    /** 拖拽节点 */
    dragNode: Node;
    /** 鼠标位置在拖动节点的偏移量 */
    dragNodeOffset: any;
    /** 鼠标位置在拖动组的偏移量 */
    dragGroupOffset: any;
    /** 移动边 */
    dragLink: {
        /** 源起节点id */
        originId: string;
        /** 源起节点 */
        originX: number;
        originY: number;
        /** 鼠标移动节点 */
        x: number;
        y: number;
        /** 来源边位置 */
    };
    dragRotate:{
        /** 源起节点id */
        originId: string;
        center:[number,number];
        first:[number,number];
        second:[number,number];
    };
    sourcePos: string;
    /** 对话框展示标志位 */
    menuDisplay: boolean;
    /** 对话框的位置信息 */
    menuPos: MenuPos;
    /** 画布的放大倍率 */
    screenScale: number;
    /** 当前鼠标悬浮的节点 */
    currentHoverNode: string;
    /** 删除框 */
    deleteVisible: boolean;
    /**当前选中节点*/
    currentSelectedNode: Node;
    // 暂存文本组件中的文本
    textCompTxt?:boolean;
}