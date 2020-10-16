/**
 * @file 画布底层位置计算相关方法
 * @author 剑决(perkin.pj)
 */

import * as _ from "lodash";
import { Point, Shape, ShapeProps } from "./types";
import { Node, Group, LINK_POSITION } from "../constants/defines";
/**
 * 两点间直线距离
 * @param sourcePoint
 * @param targetPoint
 */
export function distance(sourcePoint: Point, targetPoint: Point) {
  const x = sourcePoint.x - targetPoint.x;
  const y = sourcePoint.y - targetPoint.y;
  return Math.sqrt(x * x + y * y);
}

/**
 * 两点间曲线
 * @param sourcePoint
 * @param targetPoint
 */
export const quadratic = (sourcePoint: Point, targetPoint: Point): string => {
  const sourceX = sourcePoint.x;
  const targetX = targetPoint.x;

  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourcePoint.y + targetPoint.y) / 2;
  let tolerance = 30;

  const sub = targetPoint.y - sourcePoint.y;

  if (sub > -100 && sub < 100) {
    tolerance = Math.max(Math.abs(targetPoint.y - sourcePoint.y) / 2, 20);
  }

  return [
    "M",
    sourceX,
    sourcePoint.y,
    "Q",
    /** 横向与竖向有区别 */
    sourceX + tolerance,
    sourcePoint.y,
    centerX,
    centerY,
    "T",
    targetX - 6,
    targetPoint.y - 2
  ].join(" ");
};

/**
 * 计算屏幕缩放比例
 */
export function detectZoom() {
  let ratio = window.outerWidth / window.innerWidth;
  const screen = window.screen;
  const ua = navigator.userAgent.toLowerCase();

  if (window.devicePixelRatio !== undefined) {
    // 由于mac retina屏幕devicePixelRatio会扩大2倍，这里mac统一用window.outerWidth / window.innerWidth表示ratio
    const isMac = /macintosh|mac os x/i.test(ua);

    ratio = isMac
      ? window.outerWidth / window.innerWidth
      : window.devicePixelRatio;
  } else if (ua.indexOf("msie") > -1) {
    if ((screen as any).deviceXDPI && (screen as any).logicalXDPI) {
      ratio = (screen as any).deviceXDPI / (screen as any).logicalXDPI;
    }
  } else if (
    window.outerWidth !== undefined &&
    window.innerWidth !== undefined
  ) {
    ratio = window.outerWidth / window.innerWidth;
  }

  if (ratio) {
    ratio = Math.round(ratio * 100) / 100;
  }

  return ratio;
}

/**
 * 获取元素相对于页面的绝对位置
 */
export function getOffset(domNode: any, parentElem = window.document.body) {
  let offsetTop = 0;
  let offsetLeft = 0;
  let targetDomNode = domNode;

  while (targetDomNode !== parentElem && targetDomNode != null) {
    offsetLeft += targetDomNode.offsetLeft;
    offsetTop += targetDomNode.offsetTop;
    targetDomNode = targetDomNode.offsetParent;
  }
  return {
    offsetTop,
    offsetLeft
  };
}

/** 获取元素在页面上占据的高度 */
export function getHeight(dom: HTMLElement) {
  if (!dom) {
    return 0;
  }
  const style = window.getComputedStyle(dom);
  return (
    dom.getBoundingClientRect().height +
    Number(style.marginTop.match(/\d+/g)) +
    Number(style.marginBottom.match(/\d+/g))
  );
}

// 获取元素在页面上占据的宽度
export function getWidth(dom: HTMLElement) {
  if (!dom) {
    return 0;
  }
  const style = window.getComputedStyle(dom);
  return (
    dom.getBoundingClientRect().width +
    Number(style.marginLeft.match(/\d+/g)) +
    Number(style.marginRight.match(/\d+/g))
  );
}

/** 获取元素在页面的绝对位置 */
export function getPosition(dom: HTMLElement) {
  if (!dom) {
    return 0;
  }
  return {
    x: dom.getBoundingClientRect().x,
    y: dom.getBoundingClientRect().y
  };
}

export function calcLinkPosition(node:Node, position:string) {
  let x = node?.x + node?.width;
  let y = node?.y + node?.height / 2;
  if (position === "left") {
    x = node?.x;
    y = node?.y + node?.height / 2;
  } else if (position === "right") {
    x = node?.x + node?.width;
    y = node?.y + node?.height / 2;
  } else if (position === "top") {
    x = node?.x + node?.width / 2;
    y = node?.y;
  } else if (position === "bottom") {
    x = node?.x + node?.width / 2;
    y = node?.y + node?.height;
  }

  return {
    x,
    y
  };
}

// 处理不同图形的path数据
export function handlePathData(shape: Shape, shapeProps: ShapeProps): string {
  const { x, y, width, height, direction } = shapeProps;
  let pathData = "";
  if (shape === "rect") {
    pathData = `M${x} ${y} h ${width} v ${height} h -${width} Z`;
    if (direction === "right") {
      pathData = `M${x} ${y} h -${width} v -${height} h ${width} Z`;
    }
  }
  return pathData;
}
// 旋转角度
// cen [0,0] first:[200,400], second:[400,600]
export function getRotateAngle(cen, first, second) {
  // cen  : 中心点 [0,0]
  // first : 开始点 [1,3]
  // second : 结束位置 [3,4]
  var f_c_x = first[0] - cen[0],
      f_c_y = cen[1] - first[1],
      s_c_x = second[0] - cen[0],
      s_c_y = cen[1] - second[1];
  var c = Math.sqrt(f_c_x * f_c_x + f_c_y * f_c_y) * Math.sqrt(s_c_x * s_c_x + s_c_y * s_c_y);
  if (c == 0) return -1;
  var angle = Math.acos((f_c_x * s_c_x + f_c_y * s_c_y) / c);
  // 第一象限
  if (cen[0] - second[0] < 0 && cen[1] - second[1] < 0) {
    return angle
    // 第二象限
  } else if (cen[0] - second[0] < 0 && cen[1] - second[1] > 0) {
    return angle
    // 第三象限
  } else if (cen[0] - second[0] > 0 && cen[1] - second[1] < 0) {
    return 2 * Math.PI - angle
    // 第四象限
  } else if (cen[0] - second[0] > 0 && cen[1] - second[1] > 0) {
    return 2 * Math.PI - angle
  }
}

class Coordinate {
  x;
  y;
  constructor(x,y) {
    this.x=x;
    this.y=y;
  }
}


/**
 *
 * @param a 正方形边长
 * @param b 每一格的长度
 * @param r 循环多
 */
export function getTwoDimen(a:number,b:number) {
  const l = Math.floor(a/b)
  // 初始化返回的二维数组
  const r:Coordinate[]=[]
  // for(let i=0;i<l;i++){
  //   r[i*l]=new Coordinate(0,b*(i+1))
  // }
  // const temp = r.filter((item)=>item!=undefined)
  // for(let j=0;j<temp.length;j++){
  //   r[j*l+1]=new Coordinate(a,b*(j+1))
  //   r[j*l+2]=new Coordinate(b*(j+1),0)
  //   r[j*l+3]=new Coordinate(b*(j+1),a)
  // }
  for(let i=0;i<l;i++){
      r.push(new Coordinate((i+1)*b,0))
      r.push(new Coordinate((i+1)*b,a))
  }
  for(let i=0;i<l;i++){
    r.push(new Coordinate(0,(i+1)*b))
    r.push(new Coordinate(a,(i+1)*b,))
  }
  return r.filter((item)=>item!=undefined);
}

//转化颜色
// color:{
//   r: '241',
//       g: '112',
//     b: '19',
//     a: '1',
// }
export function getHexColor(color) {
  if(color==undefined){
    return color;
  }
  var a = parseFloat(color.a || 1),
      r = Math.floor(a * parseInt(color.r) + (1 - a) * 255),
      g = Math.floor(a * parseInt(color.g) + (1 - a) * 255),
      b = Math.floor(a * parseInt(color.b) + (1 - a) * 255)
  return '#' +
      ('0' + r.toString(16)).slice(-2) +
      ('0' + g.toString(16)).slice(-2) +
      ('0' + b.toString(16)).slice(-2)
}

/**
 * 将十六进制的颜色值转化为rgba对象
 * @param sHex
 * @param alpha
 */
export function decodeColor2Rgba(sHex, alpha = 1) {
  if(alpha==0||sHex==undefined){
    return "transparent"
  }
  // 十六进制颜色值的正则表达式
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      var sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    //  处理六位的颜色值
    var sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    // return sColorChange.join(',')
    // 或
    // return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
    return {
      r:sColorChange[0],
      g:sColorChange[1],
      b:sColorChange[2],
      a:alpha
    }
  }
}


