import {Icon} from 'antd'
import React from 'react'
import {getTwoDimen} from '../utils/calc'
const style = {
  width: '1em',
  height: '1em',
  verticalAlign: "middle",
  fill: "currentColor",
  overflow: "hidden"
};
const LeftJustifying = ()=>(
  <svg className="icon" style={style}
       viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" >
    <path
      d="M343.04 799.004444v-56.888888h227.555556v56.888888zM302.648889 810.951111l-40.248889-40.248889 120.689778-120.689778 40.220444 40.248889zM262.599111 770.275556l40.220445-40.220445 120.689777 120.689778-40.248889 40.220444zM262.542222 379.164444h568.888889v227.555556h-568.888889zM262.542222 151.608889h341.333334v170.666667h-341.333334zM148.764444 94.72h56.888889v853.333333h-56.888889z"
      ></path>
  </svg>
)
const HorizontalCenter = ()=>(
  <svg className="icon" style={style}
       viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" >
    <path
      d="M222.72 521.386667h568.888889v227.555555h-568.888889zM336.497778 293.831111h341.333333v170.666667h-341.333333zM478.72 151.608889h56.888889v739.555555h-56.888889z"
      ></path>
  </svg>
)
const RightJustifying = ()=>(
  <svg className="icon" style={style}
       viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M398.222222 799.004444v-56.888888h227.555556v56.888888zM545.28 689.777778l40.220444-40.192 120.661334 120.661333-40.220445 40.248889zM585.443556 891.164444l-40.220445-40.248888 120.661333-120.661334 40.248889 40.220445zM705.991111 606.72h-568.888889v-227.555556h568.888889zM705.991111 322.275556h-341.333333v-170.666667h341.333333zM819.768889 948.053333h-56.888889v-853.333333h56.888889z"
      ></path>
  </svg>
)
const TopJustifying = ()=>(
  <svg className="icon" style={style}
       viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M777.955556 601.884444h-56.888889v-227.555555h56.888889zM668.814222 454.684444L628.622222 414.435556l120.689778-120.689778 40.220444 40.220444zM869.944889 414.663111l-40.248889 40.220445-120.661333-120.661334 40.220444-40.248889zM585.671111 293.831111v568.888889h-227.555555v-568.888889zM301.226667 293.831111v341.333333h-170.666667v-341.333333zM927.004444 180.053333v56.888889h-853.333333v-56.888889z"
      ></path>
  </svg>
)
const BottomJustifying = ()=>(
  <svg className="icon" style={style}
       viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M764.017778 668.728889h-56.888889v-227.555556h56.888889zM775.964444 708.807111l-40.220444 40.220445-120.689778-120.689778 40.220445-40.220445zM735.573333 749.198222l-40.220444-40.248889 120.661333-120.661333 40.248889 40.220444zM344.177778 748.942222v-568.888889h227.555555v568.888889zM116.622222 748.942222v-341.333333h170.666667v341.333333zM59.733333 862.72v-56.888889h853.333334v56.888889z"
      ></path>
  </svg>
)
const VerticalCenter = ()=>(
  <svg className="icon" style={style}
       viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M486.968889 805.831111v-568.888889h227.555555v568.888889zM259.413333 692.053333v-341.333333h170.666667v341.333333zM117.191111 549.831111v-56.888889h739.555556v56.888889z"
      ></path>
  </svg>
)
const UpperOne = ()=>(
  <svg className="icon" style={style}
       viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M677.831111 483.555556v56.888888h170.666667v341.333334h-341.333334v-170.666667h-56.888888v227.555556h455.111111V483.555556h-227.555556zM52.053333 85.333333h568.888889v568.888889h-568.888889z"
      ></path>
  </svg>
)
const DownOne = ()=>(
  <svg className="icon" style={style}
       viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path d="M585.671111 597.333333h-455.111111V142.222222h455.111111z m56.888889-512h-568.888889v568.888889h568.888889zM699.448889 483.555556v227.555555h-227.555556v227.555556h455.111111V483.555556h-227.555555z"></path>
  </svg>
)
const PreviewDesktop = ()=>(
  <svg className="icon" style={style}
       viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M981.333333 85.333333a42.666667 42.666667 0 0 1 42.666667 42.666667v554.666667a42.666667 42.666667 0 0 1-42.666667 42.666666H554.666667v128h149.333333a21.333333 21.333333 0 0 1 21.333333 21.333334v42.666666a21.333333 21.333333 0 0 1-21.333333 21.333334h-384a21.333333 21.333333 0 0 1-21.333333-21.333334v-42.666666a21.333333 21.333333 0 0 1 21.333333-21.333334H469.333333v-128H42.666667a42.666667 42.666667 0 0 1-42.666667-42.666666V128a42.666667 42.666667 0 0 1 42.666667-42.666667h938.666666z m-42.666666 85.333334H85.333333v469.333333h853.333334V170.666667z"
      ></path>
  </svg>
)
// 来自于 阿里巴巴矢量图库
// https://www.iconfont.cn/collections/detail?spm=a313x.7781069.1998910419.d9df05512&cid=25957
export const LeftJustifyingIcon = props => <Icon component={LeftJustifying} {...props} />;
export const HorizontalCenterIcon = props => <Icon component={HorizontalCenter} {...props} />;
export const RightJustifyingIcon = props => <Icon component={RightJustifying} {...props} />;
export const TopJustifyingIcon = props => <Icon component={TopJustifying} {...props} />;
export const BottomJustifyingIcon = props => <Icon component={BottomJustifying} {...props} />;
export const VerticalCenterIcon = props => <Icon component={VerticalCenter} {...props} />;
export const UpperOneIcon = props => <Icon component={UpperOne} {...props} />;
export const DownOneIcon = props => <Icon component={DownOne} {...props} />;
export const PreviewDesktopIcon = props => <Icon component={PreviewDesktop} {...props} />;





// 网格背景图片
export const GridBackgroundSVG = ({width = 410, height = 410, strokeColor = '#33001A'}: HeroPatternProps)=>{
    let d1 = "";
    const d2 = `M ${width} 0 L 0 0 0 ${height}`
    const coord = getTwoDimen(width,41);
    for(let i=0;i<coord.length;i++){
        if (i%2==0){
            d1+=`M ${coord[i].x} ${coord[i].y}`
        }else {
            d1+=` L ${coord[i].x} ${coord[i].y}`
        }
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
            <defs>
                <pattern id="grid" width={width} height={height} patternUnits="userSpaceOnUse">
                    <path d={d1} fill="none" stroke={strokeColor} opacity="0.2" strokeWidth="1"/>
                    <path d={d2} fill="none" stroke={strokeColor} strokeWidth="2"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
    )
}

//     <h2
// style={{
//     backgroundImage: `url("data:image/svg+xml,${svgString}")`,
//         height:200
// }}
// >
// Svg background
// </h2>

export interface HeroPatternProps {
    width?: number;
    height?: number;
    strokeColor?: string;
}






