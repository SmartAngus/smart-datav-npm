import React,{ useRef,useState,useContext,useEffect,useMemo } from 'react'
import { renderToStaticMarkup } from 'react-dom/server';
import { Tabs, Collapse, Select, Input, Tooltip, Icon,InputNumber, Button,Radio, Checkbox } from 'antd'
import * as _ from 'lodash'
import ColorsPicker from './ColorsPicker'
import "../components/NodePanel.scss";
import "./RenderPropertySidebar.scss"
import {Group, Link,Node} from "../constants/defines";
// import preImage1 from '../../../assets/images/pre-image1.jpg'
// import preImage2 from '../../../assets/images/pre-image2.png'
// import preImage3 from '../../../assets/images/pre-image3.jpg'
import UploadBgImg from "../components/uploadBgImg/UploadBgImg";
import LeftJustifying,{GridBackgroundSVG} from "../icons/editorIcons";
import {getHexColor} from '../utils/calc'


const { TabPane } = Tabs
const Panel = Collapse.Panel;
const {Option} = Select
const ButtonGroup = Button.Group;

export class OptionsProperty  {
    id?:number;
    name?:string;
    selectedNodes?:any;
    nodes?:Node[];
    groups?:Group[];
    links?:Link[];
    updateNodes?:any;
    setCanvasProps?:any;
    // 看版样式
    canvasProps?:any;
    autoSaveSettingInfo?:(canvasProps:any,nodes:Node[],groups:Group[],links:Link[])=>void;
    setDragNode?:(node:Node)=>void;
}
// 定义页面尺寸
const pageSizes = [
    {key:'1060*520',text:'1060*520',width:1060,height:520},
    {key:'1920*1080',text:'1920*1080',width:1920,height:1080},
    {key:'1440*900',text:'1440*900',width:1440,height:900},
    {key:'1366*768',text:'1366*768',width:1366,height:768},
]
const pageSizes2 = [
    {key:'1024*768',text:'1024*768',width:1024,height:768},
    {key:'800*600',text:'800*600',width:800,height:600},
]
const fontFamilies = [
    {key:1,name:'微软雅黑'},
    {key:2,name:'宋体'},
    {key:3,name:'隶书'},
    {key:4,name:'sans-serif'},
    {key:5,name:'serif'},
    {key:6,name:'Verdana'},
]
const dataFormats = [
    {key:'L',name:'YYYY-MM-DD'},
    {key:'LL',name:'YYYY/MM/DD'},
    {key:'l',name:'YY/MM/DD'},
    {key:'ll',name:'MM/DD'},
]
const timeFormats = [
    {key:'LTS',name:'hh:mm:ss'},
    {key:'LT',name:'hh:mm(24h)'},
]
const preImages = [
    {key:1,img:""},
    {key:2,img:""},
    {key:3,img:""},
]
// 箭头类型
const arrowTypes =[
    {key:0,value:'none',name:'无'},
    {key:1,value:'typical',name:'typical'},
    {key:2,value:'open',name:'open'},
    {key:3,value:'block',name:'block'}
]
// 线段类型
const lineTypes = [
    {key:0,value:'0,0',name:'直线'},
    {key:1,value:'5,5',name:'虚线'},
    {key:1,value:'0,11',name:'虚线2'},
]

const RenderPropertySidebar = React.forwardRef((props:OptionsProperty, ref)=>{
    const sidebarRef = useRef(null)
    const {selectedNodes,nodes,groups,links,updateNodes,canvasProps,setCanvasProps,autoSaveSettingInfo} = props;
    const [isSelf,setIsSelf] = useState(false)

    const [gridSize,setGridSize]=useState(10)
    let [showGrid,setShowGrid]=useState(false)
    let [gridColor,setGridColor]=useState("transparent")

    useEffect(()=>{
        if(canvasProps&&canvasProps.grid){
            setGridSize(canvasProps.grid.size)
            setShowGrid(canvasProps.grid.show)
            canvasProps.grid.color&&setGridColor(canvasProps.grid.color)
        }
    },[canvasProps])



    let isCompSetting= false
    let isSetting = false
    // convert component to string useable in data-uri
    let svgString = encodeURIComponent(renderToStaticMarkup(<GridBackgroundSVG strokeColor={gridColor} />));
    //svgString = btoa(svgString);
    // setCanvasProps(defaultCanvasProps)

    // 存的是node的id，是一个数组
    // // console.log("selectedNodes==",selectedNodes)
    // // console.log("nodes==",nodes)
    const node = _.find(nodes, n => n.id === selectedNodes[0]);
    if(node===undefined){
        isCompSetting=false
        isSetting=true
    }else{
        isCompSetting=true
        isSetting=false
    }

    // 切换tab发生的回掉函数
    const onTabChange = () => {
        // // console.log("onTabChange")

    }
    const collapseKey = () => {

    }
    const handleCollapseKey = () => {

    }
    const handleChange = (value) => {
        if(value === 'self'){
            setIsSelf(true)
        }else{
            setIsSelf(false)
        }
    }
    const handleCanvasChange = (value) => {
        let canvasSize = _.find(pageSizes,s=>s.key===value)
        if(canvasSize === undefined){
            canvasSize = _.find(pageSizes2,s=>s.key===value)
        }
        canvasProps.height=canvasSize.height;
        canvasProps.width=canvasSize.width;
        setCanvasProps(canvasProps)
        autoSaveSettingInfo(canvasProps,nodes,groups,links)
    }
    //屏幕尺寸变化
    const onCanvasWChange=(value)=>{
        canvasProps.width=value;
        setCanvasProps(canvasProps)
        autoSaveSettingInfo(canvasProps,nodes,groups,links)
    }
    const onCanvasHChange=(value)=>{
        canvasProps.height=value;
        setCanvasProps(canvasProps)
        autoSaveSettingInfo(canvasProps,nodes,groups,links)
    }
    // 预设背景发生变化
    const handlePreBgImg = (image)=>{
        if(canvasProps.backgroundImageKey == image.key){
            canvasProps.backgroundImage=null;
            canvasProps.backgroundImageKey = null
        }else{
            canvasProps.backgroundImage=`url(${image.img})`;
            canvasProps.backgroundImageKey = image.key
        }
        setCanvasProps(canvasProps)
        autoSaveSettingInfo(canvasProps,nodes,groups,links)
    }
    // 是否显示网格
    const handleChangeGrid=(e)=>{
        if(e.target.checked){
            setShowGrid(true)
            canvasProps.grid.show=true
            canvasProps.grid.url = svgString
            canvasProps.grid.size=gridSize
        }else{
            setShowGrid(false)
            canvasProps.grid.show=false
            canvasProps.grid.url = null
            canvasProps.grid.size=10
        }
        setCanvasProps(canvasProps)
        autoSaveSettingInfo(canvasProps,nodes,groups,links)
    }
    // 网格大小改变
    const handleChangeGridSize=(value)=>{
        setGridSize(value)
        if(showGrid){
            let svgString = encodeURIComponent(renderToStaticMarkup(
                <GridBackgroundSVG height={value*20} width={value*20} strokeColor={gridColor} />)
            );
            canvasProps.grid.url = svgString
            canvasProps.grid.size=value
            setCanvasProps(canvasProps)
            autoSaveSettingInfo(canvasProps,nodes,groups,links)
        }
    }
    // 画布背景颜色改变
    const handleSetBgColor = (color)=>{
        canvasProps.backgroundColor=color;
        setCanvasProps(canvasProps)
        autoSaveSettingInfo(canvasProps,nodes,groups,links)
    }
    // 边框的颜色
    const handleSetBoxBorderColor = (color)=>{
        // 深度复制，防止改变一个颜色而使整个颜色都改变了
        const newNode = _.cloneDeep(node)
        if(newNode.style) {
            newNode.style.borderColor = color;
            updateNodes(newNode)
        }
    }
    // 边框的填充色
    const handleSetBoxBgColor = (color)=>{
        const newNode = _.cloneDeep(node)
        if(newNode.style){
            newNode.style.backgroundColor = color;
            updateNodes(newNode)
        }
    }
    // 边框的粗细
    const handleSetBoxBorderWidth = (size)=>{
        const newNode = _.cloneDeep(node)
        if(newNode.style){
            newNode.style.borderWidth = size;
            updateNodes(newNode)
        }
    }
    // 网格颜色改变
    const handleSetGridColor = (color)=>{
        setGridColor(color)
        canvasProps.grid.color=color
        let svgString = encodeURIComponent(renderToStaticMarkup(
            <GridBackgroundSVG height={gridSize*20} width={gridSize*20} strokeColor={gridColor} />)
        );
        canvasProps.grid.url = svgString
        setCanvasProps(canvasProps)
        autoSaveSettingInfo(canvasProps,nodes,groups,links)
    }
    // 设置文本组件字体
    const handleSetTextFontFamily = (fontFamily)=>{
        const newNode = _.cloneDeep(node)
        if(newNode.style) {
            newNode.style.fontFamily = fontFamily;
            updateNodes(newNode)
        }
    }
    // 设置文本组件字体大小
    const handleSetTextFontSize = (fontSize)=>{
        const newNode = _.cloneDeep(node)
        if(newNode.style) {
            newNode.style.fontSize = fontSize;
            updateNodes(newNode)
        }
    }
    // 设置字体颜色
    const handleSetTextFontColor = (fontColor)=>{
        const newNode = _.cloneDeep(node)
        if(newNode.style) {
            newNode.style.color = fontColor;
            updateNodes(newNode)
        }
    }
    // 设置文本对齐方式
    const handleFontTextAlign = (align)=>{
        const newNode = _.cloneDeep(node)
        if(newNode.style) {
            newNode.style.textAlign = align;
            updateNodes(newNode)
        }
    }
    // 设置显示日期
    const handleShowDate = (e)=>{
        console.log('handleShowDate==',e.target.checked)
        const newNode = _.cloneDeep(node)
        if(newNode.chart) {
            newNode.chart.format.d.show = e.target.checked;
            updateNodes(newNode)
        }
    }
    // 设置显示时间
    const handleShowTime = (e)=>{
        const newNode = _.cloneDeep(node)
        if(newNode.chart) {
            node.chart.format.t.show = e.target.checked;
            newNode.chart.format.t.show = e.target.checked;
            updateNodes(newNode)
        }
    }
    // 设置日期格式
    const handleSetTimerDate = (value)=>{
        const newNode = _.cloneDeep(node)
        if(newNode.chart) {
            newNode.chart.format.d.fm = value;
            updateNodes(newNode)
        }
    }
    // 设置日期时分格式
    const handleSetTimerTime = (value)=>{
        const newNode = _.cloneDeep(node)
        if(newNode.chart) {
            newNode.chart.format.t.fm = value;
            updateNodes(newNode)
        }
    }
    // 设置线段类型
    const handleSetLineDashArray = (value)=>{
        const newNode = _.cloneDeep(node)
        if(newNode.chart) {
            newNode.chart.stroke.dashArray = value;
            updateNodes(newNode)
        }
    }
    // 设置线段颜色
    const handleSetLineStrokeColor = (color)=>{
        const newNode = _.cloneDeep(node)
        if(newNode.chart) {
            newNode.chart.stroke.color = color;
            updateNodes(newNode)
        }
    }
    // 设置线段宽度
    const handleSetLineStrokeWidth = (value)=>{
        const newNode = _.cloneDeep(node)
        if(newNode.chart) {
            newNode.chart.stroke.width = value;
            updateNodes(newNode)
        }
    }
    // 设置线段末端箭头
    const handleSetLineEndMarker = (marker)=>{
        const newNode = _.cloneDeep(node)
        if(newNode.chart) {
            newNode.chart.stroke.endMarker = marker;
            updateNodes(newNode)
        }
    }
    // 位置和尺寸改变
    const onInputPositionXChange = (value)=>{node.x = value;updateNodes(node)}
    const onInputPositionYChange = (value)=>{node.y = value;updateNodes(node)}
    const onInputSizeWChange = (value)=>{
        node.width = value;updateNodes(node)
    }
    const onInputSizeHChange = (value)=>{node.height = value;updateNodes(node)}
    // 旋转角度改变
    const onInputRotateChange = (value)=>{node.rotate = value;updateNodes(node)}
    const onInputChange = (value)=>{
        node.x = value;
    }
    const parserInputValue = (value)=>{
        let reg = /(\D+)\s(\d+)\s(\D+)/
        let r = value.match(reg);
        return r&&r[2]
    }
    // 根据不同的组件类型渲染不同的组件属性
    let isLineComp=false;
    let isCommonComp=false;
    if(node?.key=='line'){
        isLineComp=true
    }else{
        isLineComp=false;
        isCommonComp=true;
    }

    // 渲染自定义页面设置
    const renderPageSetting = ()=>{
            return (
                <React.Fragment>
                <h3 style={{borderBottom:'2px solid #ccc',paddingBottom:10}}>页面设置</h3>
                <div className="self-setting-size">
                    <span>
                        <p>W</p>
                        <InputNumber min={640} max={1920} value={canvasProps.width} onChange={onCanvasWChange} />
                    </span>
                    <span>
                        <p>H</p>
                        <InputNumber min={480} max={1080} value={canvasProps.height} onChange={onCanvasHChange} />
                    </span>
                    <span><p>&nbsp;</p><Button type="link" icon="retweet"/></span>
                </div>
                <Collapse
                    defaultActiveKey={['1']}
                    onChange={handleCollapseKey}
                    bordered={true}
                    accordion={false}
                >
                    <Panel header="预设尺寸" key="1">
                        <ul className="bant-list-items">
                            <li className="bant-list-item">
                                <div className="bant-list-item-extra">
                                    <div className="preview-box"></div>
                                </div>
                                <div className="bant-list-item-main">
                                    <div className="bant-list-item-meta"><h3>16:9</h3></div>
                                    <div className="bant-list-item-meta-content">
                                            {pageSizes.map((size,key)=>{
                                                return <a
                                                    onClick={()=>handleCanvasChange(size.key)}
                                                    key={key}
                                                    className="canvas-size-row">{size.text}</a>
                                            })}
                                    </div>
                                </div>
                            </li>
                            <li className="bant-list-item">
                                <div className="bant-list-item-extra">
                                    <div className="preview-box box-four-to-three"></div>
                                </div>
                                <div className="bant-list-item-main">
                                    <div className="bant-list-item-meta"><h3>4:3</h3></div>
                                    <div className="bant-list-item-meta-content">
                                        {pageSizes2.map((size,key)=>{
                                            return <a  onClick={()=>handleCanvasChange(size.key)}
                                                key={key} className="canvas-size-row">{size.text}</a>
                                        })}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </Panel>
                    <Panel header="背景" key="2">
                        <div className="components-box">
                            <ul>
                                <li style={{display:'flex'}}>背景颜色：<ColorsPicker  onSetColor={handleSetBgColor}/></li>
                                <li style={{display:'flex'}}>背景图片：<UploadBgImg/></li>
                                <li>
                                    <p style={{textAlign:'left'}}>预设图片：</p>
                                    <div className="preinstall-bg-img">
                                        {preImages.map((image,key)=>{
                                            return (
                                                <div key={key} className="pre-mini-img" onClick={()=>handlePreBgImg(image)}>
                                                    <img src={image.img} alt=""/>
                                                    {canvasProps.backgroundImageKey == image.key?<Button
                                                        className="pre-img-selected-icon"
                                                        size="small" type="primary" shape="circle" icon="check" />:''}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </li>
                                <li className="grid-setting">
                                    <Checkbox  checked={showGrid} onChange={handleChangeGrid} >网格</Checkbox>
                                    <InputNumber
                                        value={gridSize}
                                        min={10}
                                        max={100}
                                        formatter={value => `${value}px`}
                                        parser={value => value.replace('px', '')}
                                        onChange={handleChangeGridSize}
                                    />
                                    <ColorsPicker onSetColor={handleSetGridColor}/>
                                </li>
                            </ul>
                        </div>
                    </Panel>
                </Collapse>
                </React.Fragment>
            )
    }
    // 渲染普通组件的外观属性
    const renderCommonOutward=useMemo(()=>{
        return ()=>{
            return (<div className="components-box">
                <div className="components-box-inner">
                    <label>填充</label>
                    <ColorsPicker
                        defaultColor={node?.style?.backgroundColor}
                        onSetColor={handleSetBoxBgColor}/>
                </div>
                <div className="components-box-inner">
                    <label>边框</label>
                    <ColorsPicker
                        defaultColor={node?.style?.borderColor}
                        onSetColor={handleSetBoxBorderColor}/>
                    <InputNumber
                        value={node?.style?.borderWidth}
                        min={0}
                        max={4}
                        formatter={value => `${value}px`}
                        parser={value => value.replace('px', '')}
                        onChange={handleSetBoxBorderWidth}
                    />
                </div>
            </div>)
        }
    },[node?.style])

    // 渲染直线外观属性
    const renderLineOutward=useMemo(()=>{
        return ()=>{return (
            <div className="components-box">
                <div className="components-box-inner">
                    <label>线段类型</label>
                    <Select defaultValue={node.chart?.stroke.dashArray}
                            style={{ width: 100,marginRight:20 }}
                            onChange={handleSetLineDashArray}>
                        {lineTypes.map((item,key)=>{
                            return <Option key={key} value={item.value}>{item.name}</Option>
                        })}
                    </Select>
                </div>
                {/*<div className="components-box-inner">*/}
                {/*    <label>首端箭头</label>*/}
                {/*    <Select defaultValue={node.style?.fontFamily}*/}
                {/*            style={{ width: 100,marginRight:20 }}*/}
                {/*            onChange={handleSetTextFontFamily}>*/}
                {/*        {arrowTypes.map((item,key)=>{*/}
                {/*            return <Option key={key} value={item.value}>{item.name}</Option>*/}
                {/*        })}*/}
                {/*    </Select>*/}
                {/*</div>*/}
                <div className="components-box-inner">
                    <label>箭头</label>
                    <Select defaultValue={node.chart?.stroke.endMarker}
                            style={{ width: 100,marginRight:20 }}
                            onChange={handleSetLineEndMarker}>
                        {arrowTypes.map((item,key)=>{
                            return <Option key={key} value={item.value}>{item.name}</Option>
                        })}
                    </Select>
                </div>
                <div className="components-box-inner">
                    <label>线段颜色</label>
                    <ColorsPicker
                        defaultColor={node.chart?.stroke.color}
                        onSetColor={handleSetLineStrokeColor}/>
                </div>
                <div className="components-box-inner">
                    <label>线段宽度</label>
                    <InputNumber
                        style={{width:110}}
                        value={node&&node.chart?.stroke?.width}
                        formatter={value => `${value} px`}
                        min={0}
                        max={10}
                        parser={parserInputValue}
                        onChange={handleSetLineStrokeWidth}
                    />
                </div>
            </div>
        )}
    },[node?.chart?.stroke])
    // 渲染组件属性
    const renderCompSetting = ()=>{
        return (
            <Tabs defaultActiveKey="1" onChange={onTabChange}>
                <TabPane tab="样式" key="1">
                    <div className="nodePanel">
                        <div className="aa">
                            <div className="nodePanel-box-collapse">
                                <Collapse
                                    defaultActiveKey={['1']}
                                    onChange={handleCollapseKey}
                                    bordered={true}
                                    accordion={false}
                                >
                                    <Panel header="位置和尺寸" key="1">
                                        <div className="components-box">
                                            <InputNumber
                                                style={{width:110}}
                                                value={node&&node.x}
                                                formatter={value => `X ${value} px`}
                                                parser={parserInputValue}
                                                onChange={onInputPositionXChange}
                                            />
                                            <InputNumber
                                                style={{width:110}}
                                                value={node&&node.y}
                                                min={10}
                                                max={2042}
                                                formatter={value => `Y ${value} px`}
                                                parser={parserInputValue}
                                                onChange={onInputPositionYChange}
                                            />
                                        </div>
                                        <div className="components-box">
                                            <InputNumber
                                                style={{width:110}}
                                                value={node&&node.width}
                                                formatter={value => `W ${value} px`}
                                                parser={parserInputValue}
                                                onChange={onInputSizeWChange}
                                            />
                                            <InputNumber
                                                style={{width:110}}
                                                value={node&&node.height}
                                                min={10}
                                                max={1080}
                                                formatter={value => `H ${value} px`}
                                                parser={parserInputValue}
                                                onChange={onInputSizeHChange}
                                            />
                                        </div>
                                        <div className="components-box">
                                            <InputNumber
                                                style={{width:110}}
                                                value={node&&node.rotate}
                                                min={-360}
                                                max={360}
                                                formatter={value => `旋转 ${value} deg`}
                                                parser={parserInputValue}
                                                onChange={onInputRotateChange}
                                            />
                                        </div>
                                    </Panel>
                                    <Panel header="文本" key="2">
                                        <div className="components-box">
                                            <div className="components-box-inner">
                                                <label>字体</label>
                                                <Select defaultValue={node.style?.fontFamily}
                                                        style={{ width: 120 }}
                                                        onChange={handleSetTextFontFamily}>
                                                    {fontFamilies.map((item,key)=>{
                                                        return <Option key={key} value={item.name}>{item.name}</Option>
                                                    })}
                                                </Select>
                                            </div>
                                            <div className="components-box-inner">
                                                <label>字号</label>
                                                <InputNumber
                                                    style={{width:120}}
                                                    value={node.style?.fontSize}
                                                    min={12}
                                                    max={72}
                                                    formatter={value => `${value}px`}
                                                    parser={value => value.replace(/\[X|px]/g, '')}
                                                    onChange={handleSetTextFontSize}
                                                />
                                            </div>
                                            <div className="components-box-inner">
                                                <label>颜色</label>
                                                <ColorsPicker
                                                    defaultColor={node.style?.color}
                                                    onSetColor={handleSetTextFontColor}/>
                                            </div>
                                            <div className="components-box-inner">
                                                <label>对齐</label>
                                                <ButtonGroup>
                                                    <Button type="default"  icon="align-left"
                                                            onClick={()=>handleFontTextAlign('left')} />
                                                    <Button type="default"
                                                            icon="align-center"
                                                            onClick={()=>handleFontTextAlign('center')} />
                                                    <Button type="default"  icon="align-right"
                                                        onClick={()=>handleFontTextAlign('right')}/>
                                                </ButtonGroup>
                                            </div>
                                        </div>
                                    </Panel>
                                    <Panel header="外观" key="3">
                                        {isCommonComp&&renderCommonOutward()}
                                        {isLineComp&&renderLineOutward()}
                                    </Panel>
                                    {node.chart?.type == 'time'?(
                                        <Panel header="时间格式" key="4">
                                            <div className="components-box">
                                                <div className="components-box-inner">
                                                    <Checkbox defaultChecked={node.chart?.format?.d?.show}
                                                              onChange={handleShowDate}>日期</Checkbox>
                                                    <Select defaultValue={node.chart?.format?.d?.fm}
                                                            style={{ width: 180 }}
                                                            onChange={handleSetTimerDate}>
                                                        {dataFormats.map((item,key)=>{
                                                            return <Option key={key} value={item.key}>{item.name}</Option>
                                                        })}
                                                    </Select>
                                                </div>
                                                <div className="components-box-inner">
                                                    <Checkbox defaultChecked={node.chart?.format?.t?.show}
                                                              onChange={handleShowTime}>时间</Checkbox>
                                                    <Select defaultValue={node.chart?.format?.t?.fm}
                                                            style={{ width: 180 }}
                                                            onChange={handleSetTimerTime}>
                                                        {timeFormats.map((item,key)=>{
                                                            return <Option key={key} value={item.key}>{item.name}</Option>
                                                        })}
                                                    </Select>
                                                </div>
                                            </div>
                                        </Panel>
                                    ):''}
                                </Collapse>
                            </div>
                        </div>
                    </div>
                </TabPane>
                <TabPane tab="数据" key="2">
                    Content of Tab Pane 2
                </TabPane>
            </Tabs>
        )
    }

    return (
        <div className="editor-property">
            {isSetting&&renderPageSetting()}
            {isCompSetting&&renderCompSetting()}
        </div>
    )
})
export default RenderPropertySidebar;
