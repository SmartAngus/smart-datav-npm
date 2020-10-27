import {Icon} from 'antd'
import React from 'react'
import {getTwoDimen} from '../utils/calc'
const style = {
  width: '1em',
  height: '1em',
  verticalAlign: "middle",
  fill: "currentColor",
  overflow: "hidden",
  color:"#989898"
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
const TextOfRect = ()=>(
  <svg className="icon" style={style}
       viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path d="M938.666667 42.666667a42.666667 42.666667 0 0 1 42.666666 42.666666v853.333334a42.666667 42.666667 0 0 1-42.666666 42.666666H85.333333a42.666667 42.666667 0 0 1-42.666666-42.666666V85.333333a42.666667 42.666667 0 0 1 42.666666-42.666666h853.333334z m-42.666667 85.333333H128v768h768V128z m-234.666667 192.213333a21.333333 21.333333 0 0 1 21.333334 21.333334v42.666666a21.333333 21.333333 0 0 1-21.333334 21.333334H554.666667v277.333333a21.333333 21.333333 0 0 1-21.333334 21.333333h-42.666666a21.333333 21.333333 0 0 1-21.333334-21.333333v-277.333333H362.666667a21.333333 21.333333 0 0 1-21.333334-21.333334v-42.666666a21.333333 21.333333 0 0 1 21.333334-21.333334h298.666666z"></path>
  </svg>
)
const ReplaceTwo = ()=>(
  <svg className="icon" style={style}
       viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path d="M277.461333 618.752l1.450667 0.085333H917.333333a21.333333 21.333333 0 0 1 20.992 17.536l0.341334 3.84v42.666667a21.333333 21.333333 0 0 1-21.333334 21.333333H298.794667v106.709334a21.333333 21.333333 0 0 1-38.4 12.8l-128-170.88a21.333333 21.333333 0 0 1 17.066666-34.133334h128z m529.066667-418.218667l128 170.88a21.333333 21.333333 0 0 1-17.066667 34.133334H149.333333a21.333333 21.333333 0 0 1-21.333333-21.333334v-42.666666a21.333333 21.333333 0 0 1 21.333333-21.333334h618.752V213.333333a21.333333 21.333333 0 0 1 38.4-12.8z"></path>
  </svg>
)
const HourTime = ()=>(
  <svg className="icon" style={style}
       viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M512 896c212.08 0 384-171.92 384-384S724.08 128 512 128 128 299.92 128 512s171.92 384 384 384z m0 72C260.16 968 56 763.84 56 512S260.16 56 512 56s456 204.16 456 456-204.16 456-456 456z"></path>
    <path
      d="M713.616 665.584a36 36 0 1 1-48.696 53.04L487.648 555.848a36 36 0 0 1-11.648-26.52V224a36 36 0 1 1 72 0v289.52l165.616 152.064z"></path>
    <path d="M716 292m-36 0a36 36 0 1 0 72 0 36 36 0 1 0-72 0Z" p-id="25811"></path>
    <path d="M788 516m-36 0a36 36 0 1 0 72 0 36 36 0 1 0-72 0Z" p-id="25812"></path>
    <path d="M516 804m-36 0a36 36 0 1 0 72 0 36 36 0 1 0-72 0Z" p-id="25813"></path>
    <path d="M316 708m-36 0a36 36 0 1 0 72 0 36 36 0 1 0-72 0Z" p-id="25814"></path>
    <path d="M220 516m-36 0a36 36 0 1 0 72 0 36 36 0 1 0-72 0Z" p-id="25815"></path>
    <path d="M316 292m-36 0a36 36 0 1 0 72 0 36 36 0 1 0-72 0Z" p-id="25816"></path>
  </svg>
)
const Rectangle = ()=>(
  <svg className="icon" style={style}
       viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h1024v1024H0z" fill="#989898" p-id="28198"></path>
    <path d="M68.266667 68.266667v887.466666h887.466666V68.266667H68.266667zM0 0h1024v1024H0V0z" fill="#FFFFFF"
          ></path>
  </svg>
)
const Line = ()=>(
  <svg className="icon" style={style}
       viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M813.698893 149.961328m30.16989 30.169889l0 0q30.169889 30.169889 0 60.339779l-603.397787 603.397787q-30.169889 30.169889-60.339779 0l0 0q-30.169889-30.169889 0-60.339779l603.397787-603.397787q30.169889-30.169889 60.339779 0Z"
      ></path>
  </svg>
)
const Circle = ()=>(
  <svg className="icon" style={style}
       viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" >
    <path
      d="M858.3 311.2C894 372.5 912 439.4 912 512s-17.9 139.5-53.7 200.8C822.5 774 774 822.6 712.8 858.3S584.6 912 512 912s-139.5-17.9-200.8-53.7c-61.2-35.7-109.7-84.2-145.6-145.6C129.9 651.5 112 584.6 112 512c0-72.5 17.9-139.4 53.7-200.8 35.7-61.2 84.2-109.7 145.6-145.6C372.5 130 439.4 112 512 112c72.5 0 139.4 17.9 200.8 53.7C774 201.5 822.5 250 858.3 311.2z"
      ></path>
  </svg>
)

const LongArrow = ()=>(
  <svg className="icon" style={style}
       viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32999">
    <path d="M3.190031 483.28971972l861.30841101 0L864.49844201 563.04049872 3.19003099 563.04049872l1e-8-79.750779z"
          fill="" p-id="33000"></path>
    <path d="M823.02803698 403.53894071L1023.99999999 521.57009373l-200.97196301 121.22118401 0-239.25233703z" fill=""
          p-id="33001"></path>
  </svg>
)
const Arrow2 = ()=>(
  <svg className="icon" style={style}
       viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="38471">
    <path d="M946.88491901 515.308303L80.423388 1023.999992 329.85928401 508.744201 77.115081 0Z" p-id="38472"></path>
  </svg>
)
const style2 = {
  width: "15em",
  height: "1em",
  verticalAlign:"middle",
  fill: "currentColor",
  overflow: "hidden",
}
const DashArrow1 = (props)=>(
  <svg width="60" height="10" version="1.1"
       xmlns="http://www.w3.org/2000/svg">
    <line x1="0" y1="5" x2="60" y2="5"
          style={{stroke:"rgb(99,99,99)",strokeWidth:2}} {...props}/>
  </svg>
)
const styleDrag = {
  width: '1em',
  height: '1em',
  verticalAlign: "middle",
  fill: "currentColor",
  overflow: "hidden",
};
const DragColunm = ()=>(
  <svg className="icon" style={styleDrag}
       viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="50671">
    <path
      d="M398.222222 142.222222c0-17.066667 11.377778-28.444444 28.444445-28.444444s28.444444 11.377778 28.444444 28.444444v512c0 17.066667-11.377778 28.444444-28.444444 28.444445s-28.444444-11.377778-28.444445-28.444445v-512z m170.666667 0c0-17.066667 11.377778-28.444444 28.444444-28.444444s28.444444 11.377778 28.444445 28.444444v512c0 17.066667-11.377778 28.444444-28.444445 28.444445s-28.444444-11.377778-28.444444-28.444445v-512z"
      p-id="50672"></path>
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
export const TextOfRectIcon = props => <Icon component={TextOfRect} {...props} />;
export const ReplaceTwoIcon = props => <Icon component={ReplaceTwo} {...props} />;
export const HourTimeIcon = props => <Icon component={HourTime} {...props} />;
export const RectangleIcon = props => <Icon component={Rectangle} {...props} />;
export const LineIcon = props => <Icon component={Line} {...props} />;
export const CircleIcon = props => <Icon component={Circle} {...props} />;
export const LongArrowIcon = props => <Icon component={LongArrow} {...props} />;
export const DashArrow1Icon = props => <Icon component={()=><DashArrow1 {...props}/>} {...props} />;
export const DragColunmIcon = props => <Icon component={DragColunm} {...props} />;











// 网格背景图片
export const GridBackgroundSVG = ({width = 41, height = 41, strokeColor = '#33001A'}: HeroPatternProps)=>{
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






