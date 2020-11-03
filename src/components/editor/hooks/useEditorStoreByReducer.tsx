import * as React from "react";
import { Node, Link, Group } from "../constants/defines";
import { ZoomTransform, zoomIdentity } from "d3-zoom";
import { useLocalStorage } from "./useLocalStorage";
import { useHistory } from './useHistory'
import { useDebouncedCallback } from 'use-debounce';

const { useState, useEffect } = React;

const canvasConfig = {
  backgroundColor: "#ffffff",
  backgroundImage: null,
  backgroundImageKey: null,
  uploadBackgroundImage:{
    name:'',
    show:false,
    url:null
  },
  grid: {show: false, size: 10, color: "#662b2b",url:null},
  height: 768,
  password: null,
  width: 1366,
}

const initState =  {
  nodes:[],
  groups:[],
  links:[],
  
}

export function useEditorStoreByReducer() {
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
  const {state,set:setHistory, undo, redo, clear, canUndo, canRedo} = useHistory(editorData);
  const [canvasProps, setCanvasProps] = useState(canvasConfig)

  const [dragNode, setDragNode] = useState(null);

  const [currTrans, setCurrTrans] = useState<ZoomTransform>(zoomIdentity);

  const [copiedNodes, setCopiedNodes] = useState<Node[]>([]);
  // 保存操作历史
  const debouncedHistory = useDebouncedCallback(
    (value) => {
      setHistory(value);
    },
    1000,
    // The maximum time func is allowed to be delayed before it's invoked:
    { maxWait: 2000 }
  );

  useEffect(() => {
    console.log("setEditorData")
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
    debouncedHistory.callback({
      ...(editorData as any),
      nodes:nodes,
      links:links,
      groups: groups,
      canvasProps:canvasProps
    })
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
    debouncedHistory.callback({
      ...(editorData as any),
      nodes:nodes,
      links:links,
      groups: groups,
      canvasProps:canvasProps
    })
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
    debouncedHistory.callback({
      ...(editorData as any),
      nodes:nodes,
      links:links,
      groups: groups,
      canvasProps:canvasProps
    })
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

    debouncedHistory.callback({
      ...(editorData as any),
      nodes:nodes,
      links:links,
      groups: groups,
      canvasProps:canvasProps
    })

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
    canvasProps,
    setCanvasProps,
    handleAutoSaveSettingInfo,
    isSave,
    setIsSave,
    stateHistory:state,
    setHistory,
    undo,
    redo
  };
}
