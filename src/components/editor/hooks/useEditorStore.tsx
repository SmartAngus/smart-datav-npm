import * as React from "react";
import * as _ from "lodash";
import { Node, Link, Group } from "../constants/defines";
import { ZoomTransform, zoomIdentity } from "d3-zoom";
import { useLocalStorage } from "./useLocalStorage";

const { useState, useEffect } = React;

const canvasConfig = {
  backgroundColor: "#f0f2f5",
  backgroundImage: null,
  backgroundImageKey: null,
  uploadBackgroundImage:{
    name:'',
    show:false,
    url:null
  },
  grid: {show: true, size: 10, color: "#662b2b",url:null},
  height: 768,
  password: null,
  width: 1366,
}

export function useEditorStore() {
  const [editorData, setEditorData] = useState();
  // 是否保存了数据updateNodes
  const [isSave,setIsSave] = useState(true)
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group>(undefined);
  const [editorLocalData, setEditorLocalData] = useLocalStorage("editorData", {
    id: "editorData-local"
  });
  const [canvasProps, setCanvasProps] = useState(canvasConfig)
  const [editorLocalHistoryData,setEditorLocalHistoryData]= useLocalStorage("editorDataHistory", {
    id: "editorData-history",
    currentIndex:0,
    datas:[]
  });
  const [dragNode, setDragNode] = useState(null);

  const [currTrans, setCurrTrans] = useState<ZoomTransform>(zoomIdentity);

  const [copiedNodes, setCopiedNodes] = useState<Node[]>([]);

  useEffect(() => {
    setEditorData(editorLocalData);

    const newNodes = (editorLocalData?.nodes || []).map(item => {
      return {
        ...item,
        ref: React.createRef()
      };
    });
    setNodes(newNodes);

    const newGroups = (editorLocalData?.groups  || []).map(item => {
      return {
        ...item,
        ref: React.createRef()
      };
    });
    setGroups(newGroups);
    setLinks(editorLocalData?.links || []);
    setCanvasProps(editorLocalData?.canvasProps || canvasConfig);
  }, [editorLocalData]);

  const updateNodes = (node: Node) => {
    const index = nodes.findIndex(item => item.id === node.id);
    const newNodes = [
      ...nodes.slice(0, index),
      node,
      ...nodes.slice(index + 1)
    ];
    setNodes(newNodes);
    setIsSave(false);
  };

  const updateLinks = (link: Link) => {
    const index = links.findIndex(item => item.id === link.id);
    const newLinks = [
      ...links.slice(0, index),
      link,
      ...links.slice(index + 1)
    ];

    setLinks(newLinks);
    setIsSave(false);
  };

  const updateGroups = (group: Group) => {
    const index = groups.findIndex(item => item.id === group.id);

    const newGroups = [
      ...groups.slice(0, index),
      group,
      ...groups.slice(index + 1)
    ];

    setGroups(newGroups);
    setIsSave(false);
  };
  // 保存最新的数据
  const handleSaveData = async () => {
    setIsSave(true)
    const newNodes = nodes || [];
    const newGroups = groups || [];

    // 保存数据时，需要去掉ref
    newNodes.forEach(node => delete node.ref);
    newGroups.forEach(group => {
      delete group.ref;
      group.nodes.forEach(node => {
        delete node.ref;
      });
    });

    const result = await setEditorLocalData({
      ...(editorData as any),
      nodes: newNodes,
      groups: newGroups,
      links,
      canvasProps
    });
    return result;
  };
  // 自动保存面板属性设置，比如更改了页面尺寸，背景图片，网格信息，以便在用户浏览器刷新后恢复原样
  const handleAutoSaveSettingInfo = async (canvasProps,nodes,groups,links)=>{
    const newCanvasProps = canvasProps || {};
    handleSaveData()
    const result = await setEditorLocalData({
      ...(editorData as any),
      nodes:nodes,
      groups: groups,
      links: links,
      canvasProps:newCanvasProps
    });

    return result;
  }

  const isObjectValueEqual = (a, b)=>{
    // 判断两个对象是否指向同一内存，指向同一内存返回true
    if(a==undefined||b==undefined) return true
    if (a === b) return true
    // 获取两个对象键值数组
    let aProps = Object.getOwnPropertyNames(a)
    let bProps = Object.getOwnPropertyNames(b)
    // 判断两个对象键值数组长度是否一致，不一致返回false
    if (aProps.length !== bProps.length) return false
    // 遍历对象的键值
    for (let prop in a) {
      // 判断a的键值，在b中是否存在，不存在，返回false
      if (b.hasOwnProperty(prop)) {
        // 判断a的键值是否为对象，是则递归，不是对象直接判断键值是否相等，不相等返回false
        if (typeof a[prop] === 'object') {
          if (!isObjectValueEqual(a[prop], b[prop])) return false
        } else if (a[prop] !== b[prop]) {
          return false
        }
      } else {
        return false
      }
    }
    return true
  }
  // 保存操作历史数据
  const handleSaveHistoryData = async () => {
    const newNodes = nodes || [];
    const newGroups = groups || [];

    // 保存数据时，需要去掉ref,保存历史数据不需要，否则拿不到当前的节点
    // newNodes.forEach(node => delete node.ref);
    // newGroups.forEach(group => {
    //   delete group.ref;
    //   group.nodes.forEach(node => {
    //     delete node.ref;
    //   });
    // });
    const data = {
      ...(editorData as any),
      nodes: newNodes,
      groups: newGroups,
      links
    }
   if(editorLocalHistoryData.datas&&editorLocalHistoryData.datas.length>0){
     const isEqual = isObjectValueEqual(data,editorLocalHistoryData.datas.slice(-1)[0])
     if(isEqual){
       return;
     }else{
       editorLocalHistoryData.datas.push(data)
     }
   }else{
     editorLocalHistoryData.datas.push(data)
   }
   if(editorLocalHistoryData.datas.length>100){// 最多记录100步历史
     editorLocalHistoryData.datas.splice(0,editorLocalHistoryData.datas.length-100)
   }
    editorLocalHistoryData.currentIndex = editorLocalHistoryData.datas.length-1;
    const result = await setEditorLocalHistoryData(editorLocalHistoryData);
    return result;

  }

  return {
    editorData,
    setEditorData,
    nodes,
    setNodes,
    links,
    setLinks,
    updateNodes,
    updateLinks,
    selectedLinks,
    setSelectedLinks,
    selectedNodes,
    setSelectedNodes,
    dragNode,
    setDragNode,
    copiedNodes,
    setCopiedNodes,
    currTrans,
    setCurrTrans,
    editorLocalData,
    setEditorLocalData,
    handleSaveData,
    groups,
    setGroups,
    updateGroups,
    selectedGroup,
    setSelectedGroup,
    editorLocalHistoryData,
    setEditorLocalHistoryData,
    handleSaveHistoryData,
    canvasProps,
    setCanvasProps,
    handleAutoSaveSettingInfo,
    isSave,
    setIsSave
  };
}
