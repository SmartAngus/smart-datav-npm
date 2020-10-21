/**
 * @file 画布侧边栏组件库面板
 * @author perkinJ
 */

import * as React from "react";
import * as _ from "lodash";
import classNames from "classnames";
import { Collapse,Tabs,Icon } from "antd";
import {
  ComponentType,
  ComponentMap,
  COMPONENT_CATEGORY,
  Node, IndustrialImageProps, ImageProps
} from '../constants/defines'
import "./NodePanel.scss";
import IndustrialLibraryUpload from './IndustrialLibraryUpload'

const { useState, useEffect } = React;
const Panel = Collapse.Panel;
const {TabPane} = Tabs

interface NodePanelProps {
  visible?: boolean;
  onDrag?: (item: Node) => void;
  // 预设工业图库
  industrialLibrary?:IndustrialImageProps[];
  // 自定义的工业图库
  selfIndustrialLibrary?:ImageProps[]
}

export default function NodePanel(props: NodePanelProps) {
  const componnetList = Object.values(ComponentType);
  console.log("componnetList",componnetList)
  let { onDrag, visible = false,industrialLibrary,selfIndustrialLibrary } = props;

  // 自定义图库
  const [selfImageLibrary,setSelfImageLibrary] = useState(selfIndustrialLibrary)

  // 默认取第一个
  const [collapseKey, setCollapseKey] = useState<string[]>([componnetList[0]]);


  const boxClass = classNames("nodePanel-box", {
    "nodePanel-box-visible": visible
  });

  /** 处理Collapse展开 */
  const handleCollapseKey = (items: string[] | string) => {
    setCollapseKey(items as string[]);
  };

  const handleDrag = (item: Node) => {
    console.log("nodeitem==",item)
    if (onDrag) {
      onDrag(item);
    }
  };
  const handleImageDrag = (image:ImageProps)=>{
    console.log("image==",image)
    if (onDrag) {
      onDrag(image as Node);
    }
  }
  const onTabChange = (a)=>{
    console.log("onTabChange")
  }
  // 处理自定义图库上传完
  const handleUploadComplete = (newFile,files)=>{
    const newImage = {
      width:100,height:100,type:'image',
      name:newFile.name,
      url:newFile.url,
      key:`new_${files.length+1}`
    } as ImageProps
    const newSelfLibraryImages = _.cloneDeep(selfImageLibrary) as ImageProps[]
    newSelfLibraryImages.push(newImage)
    setSelfImageLibrary(newSelfLibraryImages)
  }

  return (
    <div className="nodePanel">
      <Tabs defaultActiveKey="1" onChange={onTabChange}>
        <TabPane tab="组件" key="1">
          <div className={boxClass}>
            <div className="nodePanel-box-collapse">
              <Collapse
                activeKey={collapseKey}
                onChange={handleCollapseKey}
                bordered={true}
                accordion
              >
                {componnetList.map(item => {
                  const total = COMPONENT_CATEGORY[item].length;
                  return (
                    <Panel
                      key={item}
                      header={
                        <div className="collapse-title">{`${
                          ComponentMap[item]
                        } (${total})`}</div>
                      }
                    >
                      <div className="components-box">
                        {COMPONENT_CATEGORY[item].map(child => {
                          const boxItemClass = classNames("components-box-item", {
                            "components-box-item-disabled no-drop": child.disabled
                          });
                          return (
                            <div
                              className={boxItemClass}
                              key={child.key}
                              draggable={true}
                              onDrag={handleDrag.bind(null, child)}
                            >
                              <div className="components-box-item-icon">
                                {child.icon}
                              </div>
                              {child.name}
                            </div>
                          );
                        })}
                      </div>
                    </Panel>
                  );
                })}
              </Collapse>
            </div>
          </div>
        </TabPane>
        <TabPane tab="图库" key="2">
          <div className={boxClass}>
            <div className="nodePanel-box-collapse">
              <Collapse
                activeKey={collapseKey}
                onChange={handleCollapseKey}
                bordered={true}
                accordion
              >
                {(industrialLibrary||[]).map((item,index)=>{
                  return  (
                    <Panel key={index} header={<div className="collapse-title">{item.name}（{item.images.length}）</div>}>
                      <div className="components-box" style={{ margin: "20px 0"}}>
                        {(item.images || []).map((img,idx)=>{
                          return (
                            <div
                              key={idx}
                              className="components-box-item"
                              draggable={true}
                              onDrag={handleImageDrag.bind(null, img)}
                            >
                              <div className="components-box-item-icon">
                                <img src={img.url} alt="" style={{width:72,height:76}}/>
                              </div>
                              {img.name}
                            </div>
                          )
                        })}
                      </div>
                    </Panel>)
                })}
                <Panel
                  key={999}
                  header={
                    <div className="collapse-title">自定义图库（{selfImageLibrary?.length}）</div>
                  }
                >
                  <div className="components-box" style={{margin:"20px 0"}}>
                    {(selfImageLibrary || []).map((img,idx)=>{
                      return (
                        <div
                          key={idx}
                          className="components-box-item"
                          draggable={true}
                          onDrag={handleImageDrag.bind(null, img)}
                        >
                          <div className="components-box-item-icon">
                            <img src={img.url} alt="" style={{width:72,height:76}}/>
                          </div>
                          {img.name}
                        </div>
                      )
                    })}
                  </div>
                  <IndustrialLibraryUpload onUploadComplete={handleUploadComplete} selfLibrary={selfIndustrialLibrary}/>
                </Panel>
              </Collapse>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}
