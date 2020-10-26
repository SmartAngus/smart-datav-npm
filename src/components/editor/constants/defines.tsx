/**
 * @file 管道画布常量定义
 */

import * as React from "react";
import * as _ from "lodash";
import {BarChartOutlined, RadarChartOutlined} from "@ant-design/icons"
import {TextOfRectIcon,HourTimeIcon,RectangleIcon,LineIcon,CircleIcon} from '../icons/editorIcons'


// 组件卡片宽度高度
export const NODE_WIDTH = 220;
export const NODE_HEIGHT = 60;

// 右边菜单栏宽度
export const MENU_WIDTH = 120;
export const MENU_HEIGHT = 196;
// 右边抽屉宽度-通用
export const RIGHTDRAWER_WIDTH = 521;
// 右边抽屉宽度-调度配置
export const SHECHEDULE_RIGHTDRAWER_WIDTH = 750;

// 支持缩放的最大值跟最小值
export const MAX_SCALE = 200;
export const MIN_SCALE = 50;

// 组件之间的间距
export const COMPONENT_DISTANCE = 30;

// 全屏状态的坐标差,顶部导航到画布的距离
export const fullscreenDiffY = 130;

// 顶部导航到画布的固定举例，用于计算Context
export const CONTEXT_HEIGHT_DIFF = 155;

// 连接符
export const CONNECTOR = "_";

// 连线可连线的区域
export const LINK_AREA = 30;

// 连线不同状态的颜色
// 未连接状态
export const UNLINK = "#52619b";
// 选中状态
export const ACTIVE = "#92ade3";
// 连接状态
export const LINK = "#b4bdcf";

// 管道节点code为30，为固定值
export const operatorTypeCode = 30;

// 组件库类型
export enum ComponentType {
  /** 通用 */
  common = "common",
  /** 自定义 */
  //self = 'self'
}
// 工业图片属性
export class ImageProps{
  name!:string;// 非空断言，且不能重复
  url!:string;
  width?:number;
  height?:number;
  type?:string;
  rotate?:number;
  key!:string
}
// 工业图库属性
export interface IndustrialImageProps {
  // 分类类型
  type?:string;
  // 分类标题
  name?:string;
  // 图片路径
  images?:ImageProps[]
}

export const ComponentMap: Record<ComponentType, string> = {
  [ComponentType.common]: "通用",
  //[ComponentType.self]: '图表'
};
export class Stroke {// 直线控件有的属性
  color?:string;
  width?:number;
  dashArray?:string;// 线条类型
  startMarker?:string;// 左边线条箭头类型
  endMarker?:string;// 左边线条箭头类型
  x1?:number;
  y1?:number;
  x2?:number;
  y2?:number;
  transformOrigin?:'left'|'center'|'right'|undefined

}
// 定义echarts表
export class EChart {
  type!: string;
  component!:string;
  options?:any;
  format?:any;// 时间控件有的属性
  stroke?:Stroke;
}

export class Node {
  /** 组件分类类型 */
  type?: string;

  /** 组件key */
  key!: string;// ! 为非空断言

  /** 组件名称 */
  name!: string;

  /** 组件icon */
  icon?: React.ReactNode;

  /** 组件在画布中的横坐标 */
  x?: number;

  /** 组件在画布中的纵坐标 */
  y?: number;

  width?: number;

  height?: number;

  id?: string;

  groupId?: string;

  /** 对应的 ref */
  ref?: any;

  /** 数据分发方式, true:轮流 false:copy */
  distribute?: boolean;

  /** 其他配置信息 */
  webConfig?: {};

  disabled?: boolean;
  /** 定义描述node里面包含的图表 */
  chart?:EChart;

  /**定义基本样式*/
  style?:BaseCompStyle;

  /**定义图层**/
  zIndex?:number;

  /**定义旋转*/
  rotate?:number;
  /** 图片组件才有的URL属性 */
  url?:string
}

export class NodePanel {
  type!: string;

  key!: string;

  name!: string;

  icon!: React.ReactNode;

  disabled!: boolean;
}

export type LINK_POSITION = "left" | "right" | "top" | "bottom"|undefined;

export interface Link {
  /** 连线的唯一id, source+CONNECTOR+target的形式 */
  id: string;
  /** 来源节点id */
  source: string;
  /** 去向节点id */
  target: string;
  /** 来源节点位置 */
  sourcePos?: string;
  /** 去向节点位置 */
  targetPos?: string;
}

export interface Group {
  /** 组的id */
  id: string;
  /** 组在画布中的横坐标 */
  x: number;

  /** 组在画布中的纵坐标 */
  y: number;

  width: number;

  height: number;

  /** 包含的节点id */
  nodes?: Node[];

  /** 对应的 ref */
  ref?: any;

  /** 父级 */
  parentId?: string;

  /** 其他信息 */
  extraInfo?: any;
}

// group padding
export const GROUP_PADDING = 20;

// 连线中的icon，宽高
export const LINKICON_WIDTH = 18;
export const LINKICON_HEIGHT = 18;

export enum ComponentKey {
  rect = "rect",
  rectRadius = "rectRadius",
  circle = "circle",
  diamond = "diamond",
  polygon = "polygon",
  ellipse = "ellipse",
  star = "star",
  text = "text",
  line = "line",
  table = "table",
  time = "time",
}
// 基本组件的基本样式属性
export class BaseCompStyle {
  left?:string;
  top?:string;
  width?:string;
  height?:string;
  fontFamily?:string;
  fontSize?:number
  textAlign?:'left'|'center'|'right'|undefined;
  verticalAlign?:'top'|'middle'|'bottom'|'sub'|'super'|undefined;
  fontWeight?:number;
  textDecoration?:string;
  backgroundColor?:string;
  opacity?:number;
  borderSize?:number;
  borderStyle?:'solid'|'dotted'|undefined;
  borderWidth?:number;
  borderColor?:string;
  color?:string;
}


// 单元类型
// 输入组件
const COMMON_COMPONENT: Node[] = [
  /** 文本 */
  {
    type: ComponentType.common,
    key: ComponentKey.text,
    name: "文本",
    width: 100,
    height: 30,
    icon: (
      <TextOfRectIcon/>
    ),
    chart:{
      type: 'text',
      component: 'TextComp',
    },
    style:{
      backgroundColor:'#fff',
      borderColor:'#ccc',
      borderStyle:'solid',
      borderWidth:0,
      fontFamily:'微软雅黑',
      fontSize: 12,
      color:'#111',
      textAlign:'center'
    },
    disabled: false
  },
  /** 矩形 */
  {
    type: ComponentType.common,
    key: ComponentKey.rect,
    name: "矩形",
    width: 100,
    height: 100,
    icon: (
      <RectangleIcon />
    ),
    style:{
      backgroundColor:'#fff',
      borderColor:'#ccc',
      borderStyle:'solid',
      borderWidth:2,
    },
    rotate:0,
    disabled: false
  },
  /** 圆形 */
  {
    type: ComponentType.common,
    key: ComponentKey.circle,
    name: "圆形",
    width: 100,
    height: 100,
    icon: (
      <CircleIcon/>
    ),
    style:{
      backgroundColor:'#fff',
      borderColor:'#ccc',
      borderStyle:'solid',
      borderWidth:2,
    },
    rotate:0,
    disabled: false
  },
  /** 直线形 */
  {
    type: ComponentType.common,
    key: ComponentKey.line,
    name: "直线",
    width: 100,
    height: 20,
    icon: (
      <LineIcon/>
    ),
    chart:{
      type: 'line',
      component: 'LineComp',
      stroke:{
        color:'#52619b',
        width:4,
        x1:0,
        y1:100,
        x2:100,
        y2:0,
        dashArray:'0,0',
        transformOrigin:'left',
        endMarker:'none'
      }
    },
    rotate:0,
    disabled: false
  },
  /** 时间 */
  {
    type: ComponentType.common,
    key: ComponentKey.time,
    name: "时间",
    width: 200,
    height: 30,
    icon: (
      <HourTimeIcon/>
    ),
    chart:{
      type: 'time',
      component: 'TimeComp',
      format:{
        d:{show:true,fm:'L'},
        t:{show:true,fm:'LTS'}
      }
    },
    style:{
      backgroundColor:'#fff',
      borderColor:'#ccc',
      borderStyle:'solid',
      borderWidth:0,
      fontFamily:'微软雅黑',
      fontSize: 12,
      color:'#111',
      textAlign:'center'
    },
    disabled: false
  }
];
// 自定义组件
const SELF_COMPONENT: Node[] = [
  /** 星形 */
  {
    type: "self",//ComponentType.self
    key: ComponentKey.star,
    name: "STAR",
    width: 100,
    height: 100,
    icon: (
      <div
        style={{
          overflow: 'hidden',
          width: '80px',
          height: '80px',
          padding: '0px',
          opacity: 1
        }}
      >
        <BarChartOutlined/>
        <div className="controls-title">仪表盘</div>
      </div>
    ),
    chart:{
      type: 'pieChart',
      component: 'PieChart',
    },
    disabled: false
  },
  /** 饼图 */
  {
    type: "self",//ComponentType.self
    key: ComponentKey.ellipse,
    name: "ellipse",
    width: 200,
    height: 200,
    icon: (
      <div
        style={{
          overflow: 'hidden',
          width: '80px',
          height: '80px',
          padding: '0px',
          opacity: 1
        }}
      >
        <RadarChartOutlined />
        <div className="controls-title">饼图</div>
      </div>
    ),
    disabled: false,
    chart:{
      type: 'capsuleChart',
      component: 'CapsuleChart',
    }
  }
]

// 组件库类目
export const COMPONENT_CATEGORY: Record<ComponentType, Node[]> = {
  [ComponentType.common]: COMMON_COMPONENT
  // [ComponentType.self]: SELF_COMPONENT
};

export const keyCodeMap = {
  delete: 8,
  copy: 67,
  paste: 86
};

/** 处理弹窗全屏挂载 */
export function getContainer() {
  const pipelineDoms = document.getElementsByClassName("pipeline-canvas");
  return _.find(
    pipelineDoms,
    dom => (dom as HTMLElement).offsetParent
  ) as HTMLElement;
}

/**
 * @file 类型定义文件
 */
class MenuPos {
  id?: string;

  x!: number;

  y!: number;
}

// 节点宽高
export const VERTEX_WIDTH = 180;
export const VERTEX_HEIGHT = 32;

export { MenuPos };

// 操作类型
export enum OperateType {
  copy = "copy",
  delete = "delete"
}

export class BgImagesProps{
  key:number;
  img:any;
}

export class DataVEditorProps{
  // 数据保存到本地后的回掉的是
  onEditorSaveCb?:(data:any)=>void;
  // 用户自定义图库
  selfIndustrialLibrary:ImageProps[];
  // 预设背景图片 图片访问路径
  preInstallBgImages?:BgImagesProps[];
  // 面板数据和配置
  editorData?: {
    nodes: Node[],
    groups: Group[],
    links: Link[],
    editorConfig: any;
  };
  // 自定义预览按钮的功能
  onPreview?:(editorData:any)=>void;
  // 当点击退出按钮时
  onPoweroff?:()=>void;
  /** 间隔几分钟保存数据 */
  autoSaveInterval?:number;
  // 当点击额外配置按钮的回掉
  onExtraSetting?:()=>void;
  // 预设工业图库
  industrialLibrary?:IndustrialImageProps[];
  // 图片上传配置
  uploadConfig?:uploadConfigProps;
}
export class uploadConfigProps{
  /**基本路径*/
  baseURL!:string;
  /**自定义组件文件上传路径*/
  self!:UploadURIProps;
  preInstall!:UploadURIProps;
}
export class UploadURIProps{
  baseURL!:string;
  url!:string;
  /**请求token*/
  token!:string;
  /**需要传递的额外数据,json对象，智能嵌套一层*/
  data?:object;
}
