/**
 * @file 画布操作导航
 * @author perkinJ
 */

import * as React from "react";
import { Icon, Tooltip,Button } from "antd";
import classNames from "classnames";
import {
  launchFullscreen,
  exitFullscreen,
  isFull
} from "../utils/FullsreenUtils";
import { MIN_SCALE, MAX_SCALE } from "../constants/defines";
import "./Toolbar.scss";
import {
  LeftJustifyingIcon,
  RightJustifyingIcon,
  TopJustifyingIcon,
  PreviewDesktopIcon,
  ExitBtnIcon,
  BottomJustifyingIcon,
  VerticalCenterIcon,
  HorizontalCenterIcon,
  UpperOneIcon,
  DownOneIcon,
  ToBottomLayerIcon,
  ToTopLayerIcon,
  ToNextLayerIcon,
  ToPrevLayerIcon
} from '../icons/editorIcons'

/** 操作面板，支持全屏、缩放、自适应画布、格式化、显示比例 */

export type ToolbarType =
  | "save"
  | "fullscreen"
  | "zoom"
  | "adapt"
  | "format"
  | "ratio"
  | "shear"
  | "copy"
  | "paste"
  | "delete"
  | "dragSelect"
  | "layout"
  | "group"
  | "ungroup"
  | "preview"
  | "bringUp"
  | "undo"
  | "redo"
  | "bringDown"
  | "bringTop"
  | "bringBottom"
  | "leftJustify"
  | "horizontallyJustify"
  | "rightJustify"
  | "topJustify"
  | "verticallyJustify"
  | "bottomJustify"
  | "poweroff"
  | "extraRender";

export class ToolbarProps {
  /** 适应画布 */
  handleShowAll?: () => void;

  /** 缩放 */
  handleResizeTo?: (scale: number) => void;

  /** 以screen缩放 */
  handleScreenResizeTo?: (scale: number) => void;

  /** 改变屏幕缩放大小 */
  changeScreenScale?: (scale: number) => void;

  /** 缩放大小 */
  screenScale?: number;

  onSave?: () => void;

  onShear?: () => void;

  onCopy?: () => void;

  onPaste?: () => void;

  onDelete?: () => void;

  onDragSelect?: () => void;

  onLayout?: () => void;

  onAdapt?: () => void;

  onGroup?: () => void;

  onUnGroup?: () => void;

  onPreview?: () => void;
  //上移一层
  onBringUp?: () => void;
  //下移一层
  onBringDown?: () => void;

  //上移一层
  onBringTop?: () => void;
  //下移一层
  onBringBottom?: () => void;

  onRedo?:()=>void;

  onUndo?:()=>void;

  onLeftJustify?:()=>void;

  onHorizontallyJustify?:()=>void;

  onRightJustify?:()=>void;

  onTopJustify?:()=>void;

  onVerticallyJustify?:()=>void;

  onBottomJustify?:()=>void;

  onPoweroff?:()=>void;

  onExtraRender?:()=>void;

  /** 处理全屏 */
  // handleFullScreen?: () => void;
  /** Toolbar选项 */
  items?: ToolbarType[];
  /** isSave */
  showIsSave?:boolean;
}

const {useState}=React;

const Toolbar = React.forwardRef((props: ToolbarProps, ref: any) => {
  const {
    screenScale,
    changeScreenScale,
    handleResizeTo,
    handleScreenResizeTo,
    items,
    onShear,
    onCopy,
    onPaste,
    onDelete,
    onDragSelect,
    onSave,
    onLayout,
    onAdapt,
    onGroup,
    onUnGroup,
    onPreview,
    onBringDown,
    onBringUp,
    onBringBottom,
    onBringTop,
    onRedo,
    onUndo,
    onLeftJustify,
    onHorizontallyJustify,
    onRightJustify,
    onTopJustify,
    onVerticallyJustify,
    onBottomJustify,
    onPoweroff,
    onExtraRender,
    showIsSave
  } = props;
  const scale = String(Math.round(screenScale));

  /** 是否退出 */
  const isPowerOff = items.includes("poweroff")

  /** 是否保存 */
  const isSave = items.includes("save");

  /** 是否支持全屏 */

  const isFullScreen = items.includes("fullscreen");

  /** 是否支持缩放 */
  const isZoom = items.includes("zoom");

  /** 是否支持适应画布 */
  const isAdapt = items.includes("adapt");

  /** 是否支持格式化 */
  const isFormat = items.includes("format");

  /** 剪切 */
  const isShear = items.includes("shear");
  /** 是否支持复制 */
  const isCopy = items.includes("copy");

  const isPaste = items.includes("paste");

  const isDelete = items.includes("delete");

  const isDragSelect = items.includes("dragSelect");

  const isLayout = items.includes("layout");

  const isGroup = items.includes("group");

  const isUnGroup = items.includes("ungroup")

  const isPreview = items.includes("preview")

  const isBringUp = items.includes("bringUp")

  const isBringDown = items.includes("bringDown")

  const isBringTop = items.includes("bringTop")

  const isBringBottom = items.includes("bringBottom")

  const isUndo = items.includes("undo")

  const isRedo = items.includes("redo")

  const isLeftJustify = items.includes("leftJustify");

  const isHorizontallyJustify = items.includes("horizontallyJustify");

  const isRightJustify = items.includes("rightJustify");

  const isTopJustify = items.includes("topJustify");

  const isVerticallyJustify = items.includes("verticallyJustify");

  const isBottomJustify = items.includes("bottomJustify");

  const isExtraRenderNode = items.includes("extraRender")

  /** 当前是否是全屏状态 */

  const fullscreenStatus = isFull();

  const [screenText,setScreenText]=useState("全屏")

  /** 缩放操作 */
  const handleResize = (isLager?: boolean) => {
    let value = screenScale;
    if (isLager) {
      value = screenScale + 15;
      if (value > MAX_SCALE) {
        value = MAX_SCALE;
      }
    } else {
      value = screenScale - 15;
      if (value < MIN_SCALE) {
        value = MIN_SCALE;
      }
    }
     handleResizeTo(value / 100);
     handleScreenResizeTo(value / 100);
     changeScreenScale(value);
  };
  // 初始化缩放



  /** 处理全屏事件 */
  const handleFullScreen = () => {
    const isfull = isFull();
    if (isfull) {
      setScreenText("全屏")
      exitFullscreen();
    } else {
      launchFullscreen(ref.current);
      setScreenText("退出全屏")
    }
  };

  // 渲染按钮
  const renderButtons = () => {
    const fullScreenClassName = classNames({
      fullscreen: !fullscreenStatus,
      "fullscreen-exit": fullscreenStatus
    });

    return (
      <React.Fragment>
        {isPowerOff && (
            <div className="toolbar-btn "  onClick={onPoweroff} >
              <Tooltip title="退出">
                <ExitBtnIcon/>
                <span className="toolbar-btn-text">退出</span>
              </Tooltip>
            </div>
          )
        }
        <div className="btn-separator"></div>
        {isShear && (
          <div className="toolbar-btn" onClick={onShear} >
            <Tooltip title="剪切(Ctrl/Command+x)">
              <Icon type="scissor"/>
              <span className="toolbar-btn-text">剪切</span>
            </Tooltip>
          </div>
        )}

        {isCopy && (
          <div className="toolbar-btn" onClick={onCopy} >
            <Tooltip title="复制(Ctrl/Command+c)">
              <Icon type="copy" />
              <span className="toolbar-btn-text">复制</span>
            </Tooltip>
          </div>
        )}

        {isPaste && (
          <div className="toolbar-btn" onClick={onPaste}>
            <Tooltip title="粘贴(Ctrl/Command+v)">
              <Icon type="snippets" />
              <span className="toolbar-btn-text">粘贴</span>
            </Tooltip>
          </div>
        )}
        {isDelete && (
          <div className="toolbar-btn" onClick={onDelete} >
            <Tooltip title="删除">
              <Icon type="delete" />
              <span className="toolbar-btn-text">删除</span>
            </Tooltip>
          </div>
        )}
        <div className="btn-separator"></div>
        {isUndo && (
          <div className="toolbar-btn" onClick={onUndo} >
            <Tooltip title="撤销">
              <Icon type="undo" />
              <span className="toolbar-btn-text">撤销</span>
            </Tooltip>
          </div>
        )}
        {isRedo && (
          <div className="toolbar-btn" onClick={onRedo} >
            <Tooltip title="恢复">
              <Icon type="redo" />
              <span className="toolbar-btn-text">恢复</span>
            </Tooltip>
          </div>
        )}
        <div className="btn-separator"></div>
        {isDragSelect && (
          <div className="toolbar-btn" onClick={onDragSelect} >
            <Tooltip title="圈选">
              <Icon type="gateway"/>
              <span className="toolbar-btn-text">圈选</span>
            </Tooltip>
          </div>
        )}

        {isAdapt && (
          <div className="toolbar-btn" onClick={onAdapt} >
            <Tooltip title="适应画布">
              <Icon type="border-outer"/>
              <span className="toolbar-btn-text">适应画布</span>
            </Tooltip>
          </div>
        )}

        {isLayout && (
          <div className="toolbar-btn" onClick={onLayout} >
            <Tooltip title="格式化">
              <Icon type="layout"/>
              <span className="toolbar-btn-text">格式化</span>
            </Tooltip>
          </div>
        )}
        {isBringUp && (
            <div className="toolbar-btn" onClick={onBringUp} >
              <Tooltip title="上移一层">
                <ToPrevLayerIcon/>
                <span className="toolbar-btn-text">上移一层</span>
              </Tooltip>
            </div>
        )}
        {isBringDown && (
            <div className="toolbar-btn" onClick={onBringDown} >
              <Tooltip title="下移一层">
                <ToNextLayerIcon/>
                <span className="toolbar-btn-text">下移一层</span>
              </Tooltip>
            </div>
        )}
        {isBringTop && (
          <div className="toolbar-btn" onClick={onBringTop} >
            <Tooltip title="置于顶层">
              <ToTopLayerIcon/>
              <span className="toolbar-btn-text">置于顶层</span>
            </Tooltip>
          </div>
        )}
        {isBringBottom && (
          <div className="toolbar-btn" onClick={onBringBottom} >
            <Tooltip title="置于底层">
              <ToBottomLayerIcon/>
              <span className="toolbar-btn-text">置于底层</span>
            </Tooltip>
          </div>
        )}
        {isLeftJustify && (
            <div className="toolbar-btn" onClick={onLeftJustify} >
              <Tooltip title="左侧对齐">
                <LeftJustifyingIcon />
                <span className="toolbar-btn-text">左侧对齐</span>
              </Tooltip>
            </div>
        )}
        {isHorizontallyJustify && (
            <div className="toolbar-btn" onClick={onHorizontallyJustify} >
              <Tooltip title="水平居中">
                <HorizontalCenterIcon/>
                <span className="toolbar-btn-text">水平居中</span>
              </Tooltip>
            </div>
        )}
        {isRightJustify && (
            <div className="toolbar-btn" onClick={onRightJustify} >
              <Tooltip title="右侧对齐">
                <RightJustifyingIcon />
                <span className="toolbar-btn-text">右侧对齐</span>
              </Tooltip>
            </div>
        )}
        {isTopJustify && (
            <div className="toolbar-btn" onClick={onTopJustify} >
              <Tooltip title="顶部对齐">
                <TopJustifyingIcon />
                <span className="toolbar-btn-text">顶部对齐</span>
              </Tooltip>
            </div>
        )}
        {isVerticallyJustify && (
            <div className="toolbar-btn" onClick={onVerticallyJustify} >
              <Tooltip title="垂直居中">
                <VerticalCenterIcon />
                <span className="toolbar-btn-text">垂直居中</span>
              </Tooltip>
            </div>
        )}
        {isBottomJustify && (
            <div className="toolbar-btn" onClick={onBottomJustify} >
              <Tooltip title="底部对齐">
                <BottomJustifyingIcon />
                <span className="toolbar-btn-text">底部对齐</span>
              </Tooltip>
            </div>
        )}
        <div className="btn-separator"></div>
        {isGroup && (
          <div className="toolbar-btn" onClick={onGroup} >
            <Tooltip title="成组(Ctrl/Command+g)">
              <Icon type="block"/>
              <span className="toolbar-btn-text">成组</span>
            </Tooltip>
          </div>
        )}

        {isUnGroup && (
          <div className="toolbar-btn" onClick={onUnGroup} >
            <Tooltip title="解组(Ctrl/Command+u)">
              <Icon type="border"/>
              <span className="toolbar-btn-text">解组</span>
            </Tooltip>
          </div>
        )}
        <div className="btn-separator"></div>
        {isZoom && (
          <React.Fragment>
            <div className="toolbar-btn-wrapper">
              <div className="zoom-wrapper-inner">
                <div  className="toolbar-btn" id="toolbar-btn__zoom" onClick={handleResize.bind(null, true)}>
                  <Tooltip title="放大">
                    <Icon type="plus-circle" />
                  </Tooltip>
                </div>
                <div className="toolbar-scale">{scale}%</div>
                <div className="toolbar-btn" onClick={handleResize.bind(null, false)}>
                  <Tooltip title="缩小">
                    <Icon type="minus-circle" />
                  </Tooltip>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
        <div className="btn-separator"></div>
        {isFullScreen && (
          <div className="toolbar-btn" onClick={handleFullScreen}>
            <Tooltip title="全屏">
              <Icon type={fullScreenClassName} />
              <span className="toolbar-btn-text">{screenText}</span>
            </Tooltip>
          </div>
        )}
        {isExtraRenderNode && (
          <div className="toolbar-btn-wrapper">
            <Tooltip title="配置看版">
              <Button
                type="link"
                icon="setting"
                onClick={onExtraRender}
              >
                配置看版
              </Button>
            </Tooltip>
          </div>
        )}

        <div className="btn-separator"></div>
        {isPreview && (
          <div className="toolbar-btn-wrapper">
            <Tooltip title="保存(Ctrl/Command+p)">
              <Button onClick={onPreview}>预览</Button>
            </Tooltip>
          </div>
        )}
        {isSave && (
          <div className="toolbar-btn-wrapper">
            <Tooltip title="保存(Ctrl/Command+s)">
              <Button id="editor-_toolbarBtnSave" type="primary" onClick={onSave}>保存</Button>
            </Tooltip>
          </div>
        )}
        {!showIsSave && (
          <div className="toolbar-btn" style={{lineHeight:"60px"}}>
            <Tooltip title="修改未保存">
              <span className="toolbar-btn-text" style={{fontSize:'14px',color:'red'}}>修改未保存</span>
            </Tooltip>
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="toolbar">
      <div className="toolbar-button">{renderButtons()}</div>
    </div>
  );
});

export default Toolbar;
