import React,{ useRef,useState,useContext,useEffect,useMemo } from 'react'
import { renderToStaticMarkup } from 'react-dom/server';
import { Tabs, Collapse, Select, Input, Tooltip, Icon,InputNumber, Button, Checkbox,Row,Col } from 'antd'
import * as _ from 'lodash'
import ColorsPicker from './ColorsPicker'
import "../components/NodePanel.scss";
import "./RenderPropertySidebar.scss"
import { BgImagesProps, Group, Link, Node, UploadURIProps } from '../constants/defines'
import UploadBgImg from "../components/uploadBgImg/UploadBgImg";
import {
  GridBackgroundSVG,
  HorizontalLongRectIcon,
  DashArrow1Icon,
  LeftJustifyingIcon,
  RightJustifyingIcon,
  TopJustifyingIcon,
  VerticalLongRectIcon,
  ExitBtnIcon,
  BottomJustifyingIcon,
  VerticalCenterIcon,
  HorizontalCenterIcon
} from "../icons/editorIcons";
import { UploadFile } from 'antd/es/upload/interface'
import ResizePanel from '../components/resizeSidebar'
import ReactSwitch from '../components/reactSwitch/index'


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
    config?:UploadURIProps;
    preInstallBgImages?:BgImagesProps[];
    onLeftJustify?:()=>void;

    onHorizontallyJustify?:()=>void;

    onRightJustify?:()=>void;

    onTopJustify?:()=>void;

    onVerticallyJustify?:()=>void;

    onBottomJustify?:()=>void;
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
// 箭头类型
const arrowTypes =[
    {key:0,value:'none',name:'无'},
    {key:1,value:'typical',name:'geSprite-endclassic'},
    {key:2,value:'open',name:'geSprite-endopen'},
    {key:3,value:'block',name:'geSprite-endblock'}
]
// 线段类型
const lineTypes = [
    {key:0,value:'0,0'},
    {key:1,value:'5,5'},
    {key:1,value:'5,11'},
]

const RenderPropertySidebar = React.forwardRef((props:OptionsProperty, ref)=>{
    const sidebarRef = useRef(null)
    const {
      selectedNodes,
      nodes,
      groups,
      links,
      updateNodes,
      canvasProps,
      setCanvasProps,
      autoSaveSettingInfo,
      config,
      preInstallBgImages,
      onLeftJustify,
      onRightJustify,
      onTopJustify,
      onBottomJustify,
      onHorizontallyJustify,
      onVerticallyJustify
    } = props;
    const [isSelf,setIsSelf] = useState(false)

    const [gridSize,setGridSize]=useState(10)
    let [showGrid,setShowGrid]=useState(false)
    const bgImgRef = useRef()
    let [gridColor,setGridColor]=useState("transparent")
    const [rcSwitchState,setRcSwitchState]=useState(()=>{
      if(canvasProps.width>canvasProps.height) return false;
      return true;
    })

    const [selectPlaceholder,setSelectPlaceholder]=useState("选择画布大小")
    const [selectBgPlaceholder,setSelectBgPlaceholder] = useState("选择预设背景图")

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

    let svgString = encodeURIComponent(renderToStaticMarkup(<GridBackgroundSVG height={200} width={200} strokeColor={gridColor} />));
    // 存的是node的id，是一个数组
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
        setSelectPlaceholder(`已选择画布大小${canvasSize.width}X${canvasSize.height}`)
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
            setSelectBgPlaceholder(`选择预设背景图`)
        }else{
            canvasProps.backgroundImage=`url(${image.img})`;
            canvasProps.backgroundImageKey = image.key
          setSelectBgPlaceholder(`已选择预设背景图${image.key}`)
        }
        canvasProps.uploadBackgroundImage.show=false;
        setCanvasProps(canvasProps)
        autoSaveSettingInfo(canvasProps,nodes,groups,links)
    }
    // 当上传背景图片完成时时
    const handleSetUploadImage = (file:UploadFile)=>{
      canvasProps.uploadBackgroundImage.show=false;
      canvasProps.uploadBackgroundImage.name=file.name
      canvasProps.uploadBackgroundImage.url=file.url
      setCanvasProps(canvasProps)
      autoSaveSettingInfo(canvasProps,nodes,groups,links)
      if(bgImgRef!=undefined){
        // @ts-ignore
        bgImgRef.current&&bgImgRef.current.click()
      }
    }
    // 当删除图片时
    const handleRemoveFile = (file:UploadFile)=>{

    }
    // 当改变背景图片时
    const handleChangeBgImg = ()=>{
      canvasProps.uploadBackgroundImage.show=!canvasProps.uploadBackgroundImage.show;
      if(canvasProps.uploadBackgroundImage.show){
        canvasProps.backgroundImageKey = null;
        canvasProps.backgroundImage= `url(${canvasProps.uploadBackgroundImage.url})`
      }else{
        canvasProps.backgroundImage = null;
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
        if(newNode?.style) {
            newNode.style.borderColor = color;
            updateNodes(newNode)
        }
    }
    // 边框的填充色
    const handleSetBoxBgColor = (color)=>{
        const newNode = _.cloneDeep(node)
        if(newNode?.style){
            newNode.style.backgroundColor = color;
            updateNodes(newNode)
        }
    }
    // 边框的粗细
    const handleSetBoxBorderWidth = (size)=>{
        const newNode = _.cloneDeep(node)
        if(newNode?.style){
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
        if(newNode?.style) {
            newNode.style.fontFamily = fontFamily;
            updateNodes(newNode)
        }
    }
    // 设置文本组件字体大小
    const handleSetTextFontSize = (fontSize)=>{
        const newNode = _.cloneDeep(node)
        if(newNode?.style) {
            newNode.style.fontSize = fontSize;
            updateNodes(newNode)
        }
    }
    // 设置字体颜色
    const handleSetTextFontColor = (fontColor)=>{
        const newNode = _.cloneDeep(node)
        if(newNode?.style) {
            newNode.style.color = fontColor;
            updateNodes(newNode)
        }
    }
    // 设置文本对齐方式
    const handleFontTextAlign = (align)=>{
        const newNode = _.cloneDeep(node)
        if(newNode?.style) {
            newNode.style.textAlign = align;
            updateNodes(newNode)
        }
    }
  // font-weight: bold;
  // text-decoration: underline;
  // font-style: italic;
  // 设置文本对齐方式
    const handleFontWeight = (align)=>{
      const newNode = _.cloneDeep(node)
      if(newNode?.style) {
        newNode.style.fontWeight = newNode.style.fontWeight==='bold'?'':'bold';
        updateNodes(newNode)
      }
    }
    const handleFontStyle = (align)=>{
      const newNode = _.cloneDeep(node)
      if(newNode?.style) {
        newNode.style.fontStyle = newNode.style.fontStyle === 'italic'?'':'italic';
        updateNodes(newNode)
      }
    }
    const handleFontDecoration = (align)=>{
      const newNode = _.cloneDeep(node)
      if(newNode?.style) {
        newNode.style.textDecoration = newNode.style.textDecoration === 'underline'?'':'underline';
        updateNodes(newNode)
      }
    }
    // 设置显示日期
    const handleShowDate = (e)=>{
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
            node.chart.stroke.dashArray = value;
            newNode.chart.stroke.dashArray = value;
            updateNodes(newNode)
        }
    }
    // 设置线段颜色
    const handleSetLineStrokeColor = (color)=>{
      const newNode = _.cloneDeep(node)
      if(newNode?.chart) {
        node.chart.stroke.color = color;
        newNode.chart.stroke.color = color;
        updateNodes(newNode)
      }
    }

    // 设置线段宽度
    const handleSetLineStrokeWidth = (value)=>{
        const newNode = _.cloneDeep(node)
        if(newNode.chart) {
          node.chart.stroke.width = value;
          newNode.chart.stroke.width = value;
          updateNodes(newNode)
        }
    }
    // 设置线段末端箭头
    const handleSetLineEndMarker = (marker)=>{
        const newNode = _.cloneDeep(node)
        if(newNode.chart) {
          node.chart.stroke.endMarker = marker;
          newNode.chart.stroke.endMarker = marker;
          updateNodes(newNode)
        }
    }
    // 位置和尺寸改变
    const onInputPositionXChange = (value)=>{
      const newNode = _.cloneDeep(node)
      node.x = value;
      newNode.x = value;
      updateNodes(newNode)
    }
    const onInputPositionYChange = (value)=>{
      const newNode = _.cloneDeep(node)
      node.y = value;
      newNode.y = value;
      updateNodes(newNode)
    }
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
        let t = r&&r[2]
        t=t?.replace("°","")
        return t;
    }
    const handleRCSwitchStateChange = ()=>{
      setRcSwitchState(!rcSwitchState)
      const h = canvasProps.height;
      const w = canvasProps.width;
      canvasProps.height=w;
      canvasProps.width=h;
      setCanvasProps(canvasProps)
      autoSaveSettingInfo(canvasProps,nodes,groups,links)
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
                <Collapse
                    defaultActiveKey={['1']}
                    onChange={handleCollapseKey}
                    bordered={true}
                    accordion={false}
                >
                  <Panel  header="基础属性" key="1">
                    <div className="self-setting-size">
                      <Select
                        style={{ width: "100%",backgroundColor:'#D6D6D6' }}
                        dropdownStyle={{backgroundColor:'#D6D6D6'}}
                        placeholder={selectPlaceholder}
                        dropdownRender={menu => {
                          const r1  = pageSizes.map((size,key)=>{
                            return <Col span={12} key={key}><Button type="link"
                                      onClick={()=>handleCanvasChange(size.key)}
                                                     className="canvas-size-row">{size.text}</Button></Col>
                          })
                          const r2=pageSizes2.map((size,key)=>{
                              return <Col span={12} key={key}><Button type="link" onClick={()=>handleCanvasChange(size.key)}
                                                         className="canvas-size-row">{size.text}</Button></Col>
                            })
                          return (
                            <div style={{padding:10}} onMouseDown={e => e.preventDefault()}>
                              <Row>
                                <h3>16:9</h3>
                              </Row>
                              <Row>
                                {r1}
                              </Row>
                              <Row>
                                <h3>4:3</h3>
                              </Row>
                              <Row>
                                {r2}
                              </Row>
                            </div>
                          )
                        }}
                      >
                      </Select>
                    </div>
                    <div className="self-setting-size">
                      <span>
                          <InputNumber min={640} max={1920} value={canvasProps.width} onChange={onCanvasWChange} />
                      </span>
                      <span>
                          <InputNumber min={480} max={1920} value={canvasProps.height} onChange={onCanvasHChange} />
                      </span>
                      <span>
                        <ReactSwitch
                          onChange={handleRCSwitchStateChange}
                          checked={rcSwitchState}
                          offHandleColor="#096DD9"
                          onHandleColor="#096DD9"
                          offColor="#ccc"
                          onColor="#ccc"
                          uncheckedIcon={<VerticalLongRectIcon />}
                          checkedIcon={<HorizontalLongRectIcon/>}
                        />
                      </span>
                    </div>
                  </Panel>
                  <Panel header="背景" key="3">
                    <div className="components-box">
                      <ul style={{width:'100%'}} className="components-box-inner-ul">
                        <li>
                          <Select
                            style={{ width: "100%",backgroundColor:'#D6D6D6' }}
                            dropdownStyle={{backgroundColor:'#D6D6D6'}}
                            placeholder={selectBgPlaceholder}
                            clearIcon={<div>sas</div>}
                            dropdownRender={menu => {
                              const a = (preInstallBgImages||[]).map((image)=>{
                                return (
                                  <Col style={{position:"relative"}} span={24} key={image.key} onClick={()=>handlePreBgImg(image)}>
                                    <img src={image.img} alt="" style={{width:'100%'}}/>
                                    {canvasProps.backgroundImageKey == image.key?<Button
                                      className="pre-img-selected-icon"
                                      size="small" type="primary" shape="circle" icon="check" />:''}
                                  </Col>
                                )
                              })
                              return (
                                <div style={{padding:10}} onMouseDown={e => e.preventDefault()}>
                                  <Row>
                                    {a}
                                  </Row>
                                </div>
                              )
                            }}
                          >
                          </Select>
                        </li>
                          <li style={{display:'flex'}}>背景颜色：
                            <ColorsPicker  onSetColor={handleSetBgColor} defaultColor={canvasProps?.backgroundColor}/></li>
                          <li style={{display:'flex',lineHeight: '2rem'}}>
                            背景图片：<Checkbox style={{marginRight:10}}
                                           onChange={handleChangeBgImg} checked={canvasProps.uploadBackgroundImage.show}/>
                            <UploadBgImg
                            onUploadComplete={handleSetUploadImage}
                            onRemoveFile={handleRemoveFile}
                            uploadConfig={config}/>
                          </li>
                        <li style={{display:'none'}}>
                          <div  className="pre-mini-img" ref={bgImgRef}  onClick={()=>handleChangeBgImg()}>
                            {/*<img src={canvasProps.uploadBackgroundImage?.url} alt="" style={{width:192,height:108}}/>*/}
                            {/*{canvasProps.uploadBackgroundImage.show===true?<Button*/}
                            {/*  className="pre-img-selected-icon"*/}
                            {/*  size="small" type="primary" shape="circle" icon="check" />:''}*/}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </Panel>
                  <Panel header="网格" key="2">
                    <div className="components-box">
                      <ul style={{width:'100%'}} className="components-box-inner-ul">
                        <li className="grid-setting">
                          <Checkbox  checked={showGrid} onChange={handleChangeGrid} >网格</Checkbox>
                          <InputNumber
                            value={gridSize}
                            min={1}
                            max={30}
                            formatter={value => `${value}px`}
                            parser={parserInputValue}
                            onChange={handleChangeGridSize}
                          />
                          <ColorsPicker showCheckbox={false} onSetColor={handleSetGridColor} defaultColor={canvasProps?.grid?.color}/>
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
                        parser={parserInputValue}
                        onChange={handleSetBoxBorderWidth}
                    />
                </div>
            </div>)
        }
    },[node?.style])
    // 渲染文本外观属性
    const renderTextProperty  = useMemo(()=>{
      if(node?.key!='text'&&node?.key!='time'){
        return ()=>{
          return ""
        }
      }
      return ()=>{
        return (
          <Panel header="文本" key="2">
          <div className="components-box">
            <div className="components-box-inner">
              <label>字体</label>
              <Select value={node?.style?.fontFamily}
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
                value={node?.style?.fontSize}
                min={12}
                max={72}
                formatter={value => `${value}px`}
                parser={parserInputValue}
                onChange={handleSetTextFontSize}
              />
            </div>
            <div className="components-box-inner">
              <label>颜色</label>
              <ColorsPicker
                defaultColor={node?.style?.color}
                onSetColor={handleSetTextFontColor}/>
            </div>
            <div className="components-box-inner">
              <label style={{visibility:'hidden'}}>对齐</label>
              <ButtonGroup>
                <Button type={node?.style?.textAlign==='left'?'primary':'default'}  icon="align-left"
                        onClick={()=>handleFontTextAlign('left')} />
                <Button type={node?.style?.textAlign==='center'?'primary':'default'}
                        icon="align-center"
                        onClick={()=>handleFontTextAlign('center')} />
                <Button type={node?.style?.textAlign==='right'?'primary':'default'}  icon="align-right"
                        onClick={()=>handleFontTextAlign('right')}/>
              </ButtonGroup>
              <ButtonGroup style={{marginLeft:10}}>
                <Button type={node?.style?.fontWeight?'primary':'default'} icon="bold"
                        onClick={()=>handleFontWeight('left')} />
                <Button type={node?.style?.fontStyle?'primary':'default'}
                        icon="italic"
                        onClick={()=>handleFontStyle('center')} />
                <Button type={node?.style?.textDecoration?'primary':'default'}  icon="underline"
                        onClick={()=>handleFontDecoration('right')}/>
              </ButtonGroup>

            </div>
          </div>
          </Panel>
        )
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
                            return <Option key={key} value={item.value}>
                              <div className="geStroke"><DashArrow1Icon strokeDasharray={item.value}/></div>
                            </Option>
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
                            let classStr = `geSpriteArrow geSprite ${item.name}`
                          if(item.name=='无'){
                            return <Option key={key} value={item.value}>
                              无
                              </Option>
                          }else{
                            return <Option className="geOption" key={key} value={item.value}>
                              <div className={classStr}></div>
                            </Option>
                          }

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
                                                min={-800}
                                                max={2042}
                                                formatter={value => `X ${value} px`}
                                                parser={parserInputValue}
                                                onChange={onInputPositionXChange}
                                            />
                                            <InputNumber
                                                style={{width:110}}
                                                value={node&&node.y}
                                                min={-800}
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
                                                formatter={value => `旋转 ${value} °`}
                                                parser={parserInputValue}
                                                onChange={onInputRotateChange}
                                            />
                                        </div>
                                    </Panel>
                                          {renderTextProperty()}

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
                {/*<TabPane tab="数据" key="2">*/}
                {/*    Content of Tab Pane 2*/}
                {/*</TabPane>*/}
            </Tabs>
        )
    }

    return (
      <div className="editor-property">
           <div className="alignment-operation-wrapper">
             <ButtonGroup>
               <Tooltip title="左侧对齐"><Button type="link" onClick={onLeftJustify}><LeftJustifyingIcon/></Button></Tooltip>
               <Tooltip title="右侧对齐"><Button type="link" onClick={onRightJustify}><RightJustifyingIcon/></Button></Tooltip>
               <Tooltip title="顶部对齐"><Button type="link" onClick={onTopJustify}><TopJustifyingIcon/></Button></Tooltip>
               <Tooltip title="底部对齐"><Button type="link" onClick={onBottomJustify}><BottomJustifyingIcon/></Button></Tooltip>
               <Tooltip title="水平居中"><Button type="link" onClick={onHorizontallyJustify}><HorizontalCenterIcon/></Button></Tooltip>
               <Tooltip title="垂直居中"><Button type="link" onClick={onVerticallyJustify}><VerticalCenterIcon/></Button></Tooltip>
             </ButtonGroup>
           </div>
            {isSetting&&renderPageSetting()}
            {isCompSetting&&renderCompSetting()}
        </div>
    )
})
export default RenderPropertySidebar;
