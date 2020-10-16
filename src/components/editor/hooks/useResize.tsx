import { useState, useEffect } from 'react';
import {BaseCompStyle, EChart,Stroke} from "../constants/defines";
import {getRotateAngle,distance} from '../utils/calc'


class NodeInfo {
  width: number;
  height: number;
  x: number;
  y: number;
  chart?:EChart;
  zIndex?:number;
  lineRotate?:number;
  style?:BaseCompStyle;
  stroke?:Stroke;
  rotate?:number;
}

const useResize = (isResize: boolean, { width, height, x, y,rotate,lineRotate,...otherInfo }: NodeInfo): NodeInfo => {
  const [nodeWidth, setNodeWidth] = useState(width);
  const [nodeHeight, setNodeHeight] = useState(height);
  const [nodeLeft, setNodeLeft] = useState(x);
  const [nodeTop, setNodeTop] = useState(y);
  const [nodeRotate,setNodeRotate] = useState(lineRotate)
  const [nodeChartStroke,setNodeChartStroke]=useState(otherInfo?.chart?.stroke);


  useEffect(() => {
    setNodeLeft(x);
    setNodeTop(y);
  }, [x, y]);

  useEffect(() => {
    const resizers = document.querySelectorAll('.resizer');
    const element = document.querySelector('.resizable');

    const minSize = 20;
    // 初始高度宽度
    let originWidth = 0;
    let originHeight = 0;
    // 节点的初始位置
    let originX = 0;
    let originY = 0;
    // 鼠标拖拽的初始位置
    let originMouseX = 0;
    let originMouseY = 0;
    // 旋转中心位置
    let originCenterX = 0;
    let originCenterY = 0;

    if (isResize) {
      for (let i = 0; i < resizers.length; i++) {
        const currentResizer = resizers[i];
        currentResizer.addEventListener('mousedown', e => {
          e.preventDefault();
          originWidth = parseFloat(
            getComputedStyle(element, null)
              .getPropertyValue('width')
              .replace('px', '')
          );
          originHeight = parseFloat(
            getComputedStyle(element, null)
              .getPropertyValue('height')
              .replace('px', '')
          );
          originX = element.getBoundingClientRect().left;
          originY = element.getBoundingClientRect().top;
          originMouseX = (e as any).pageX;
          originMouseY = (e as any).pageY;

          // 计算弧度=角度*pi/180
          if(rotate==undefined) rotate=0;
          const h = rotate*Math.PI/180
          const y = width*Math.sin(h);
          const x = width*Math.cos(h)
          originCenterX = originMouseX - x
          originCenterY = originMouseY - y
              // 变更type
          window.addEventListener('mousemove', resize);
          window.addEventListener('mouseup', stopResize);
        });
        const resize = e => {
          let newWidth = 0;
          let newHeight = 0;
          let newLeft = 0;
          // 线条开始拖动，确定初始坐标点的位置
          let origin = [e.pageX-originMouseX,e.pageY-originMouseY]


          if (currentResizer.classList.contains('bottom-right')) {
            newWidth = originWidth + (e.pageX - originMouseX);
            newHeight = originHeight + (e.pageY - originMouseY);
            if (newWidth > minSize) {
              setNodeWidth(newWidth);
            }
            if (newHeight > minSize) {
              setNodeHeight(newHeight);
            }
          } else if (currentResizer.classList.contains('bottom-left')) {
            newWidth = originWidth - (e.pageX - originMouseX);
            newHeight = originHeight + (e.pageY - originMouseY);
            if (newWidth > minSize) {
              setNodeWidth(newWidth);
              setNodeLeft(nodeLeft + (e.pageX - originMouseX));
            }
            if (newHeight > minSize) {
              setNodeHeight(newHeight);
            }
          } else if (currentResizer.classList.contains('top-right')) {
            newWidth = originWidth + (e.pageX - originMouseX);
            newHeight = originHeight - (e.pageY - originMouseY);
            if (newWidth > minSize) {
              setNodeWidth(newWidth);
            }
            if (newHeight > minSize) {
              setNodeHeight(newHeight);
              setNodeTop(nodeTop + (e.pageY - originMouseY));
            }
          } else if(currentResizer.classList.contains('left')){
            // 暂时没做旋转处理
            newWidth = originWidth - (e.pageX - originMouseX);
            if (newWidth > minSize) {
              setNodeWidth(newWidth);
              setNodeLeft(nodeLeft + (e.pageX - originMouseX));
            }
          }else if(currentResizer.classList.contains('right')){
            // 鼠标移动距离
            const mouseMoveY = e.pageY - originMouseY
            newWidth = originWidth + (e.pageX - originMouseX);
            const dotDistance = distance({x:originCenterX,y:originCenterY},{x:e.pageX,y:e.pageY})
            setNodeWidth(Math.abs(dotDistance));
            nodeChartStroke.transformOrigin="left"
            // 旋转角度
            let rotateDeg = Math.atan2(mouseMoveY,newWidth)
            const orotate = rotate||0
            rotateDeg = rotateDeg*180/Math.PI+orotate
            setNodeRotate(rotateDeg)

          } else {
            newWidth = originWidth - (e.pageX - originMouseX);
            newHeight = originHeight - (e.pageY - originMouseY);
            if (width > minSize) {
              setNodeWidth(newWidth);
              setNodeLeft(nodeLeft + (e.pageX - originMouseX));
            }
            if (height > minSize) {
              setNodeHeight(newHeight);
              setNodeTop(nodeTop + (e.pageY - originMouseY));
            }
          }
        };

        const stopResize = () => {
          window.removeEventListener('mousemove', resize);
        };
      }
    }
  }, [isResize, nodeWidth, nodeHeight,nodeRotate, setNodeHeight, setNodeWidth, nodeTop, nodeLeft, setNodeTop, setNodeLeft,nodeChartStroke]);

  return {
    width: nodeWidth,
    height: nodeHeight,
    x: nodeLeft,
    y: nodeTop,
    lineRotate: nodeRotate,
    stroke: nodeChartStroke
  };
};

export { useResize };
