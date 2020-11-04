/** 渲染右侧配置区 */
import * as React from 'react'
import * as _ from 'lodash'
import * as uuid from 'uuid'
import { message, Modal } from 'antd'
import { Toolbar, NodePanel, DragSelector } from './components'
import CanvasContent from './common/CanvasContent'
import { useEditorStore, useKeyPress, useEventListener, useHistory } from './hooks'
import { ShapeProps } from './utils/useDragSelect'
import { pointInPoly } from './utils/layout'
import {
  GROUP_PADDING,
  Node,
  Group,
  DataVEditorProps
} from './constants/defines'
import RenderPropertySidebar from './common/RenderPropertySidebar'

import './index.scss'
import DataVPreview from '../preview'
import ResizePanel from './components/resizeSidebar'
import { dataURL2Blob,getScreenshot } from './utils/screenshot'
import { useShiftKey } from './hooks/useShiftKey'

const { useState, useRef, useEffect, useImperativeHandle } = React

const DataVEditor = React.forwardRef((props: DataVEditorProps, ref) => {
  const {
    onEditorSaveCb,
    editorData,
    onPreview,
    onPoweroff,
    autoSaveInterval,
    industrialLibrary,
    selfIndustrialLibrary,
    uploadConfig,
    preInstallBgImages,
    onExtraSetting
  } = props
  const [screenScale, changeScreenScale] = useState(70)
  const [dragSelectable, setDragSelectable] = useState(false)
  const [keyPressing, setKeyPressing] = useState(false)
  const [isShowPreviewModel, setIsShowPreviewModel] = useState(false)
  const {
    nodes,
    links,
    setNodes,
    setLinks,
    selectedLinks,
    setSelectedLinks,
    dragNode,
    setDragNode,
    selectedNodes,
    setSelectedNodes,
    selectedGroup,
    setSelectedGroup,
    updateNodes,
    updateLinks,
    copiedNodes,
    setCopiedNodes,
    currTrans,
    setCurrTrans,
    handleSaveData,
    groups,
    setGroups,
    canvasProps,
    setCanvasProps,
    handleAutoSaveSettingInfo,
    isSave,
    setIsSave,
    stateHistory,
    setHistory,
    undo,
    redo,
    clear,
  } = useEditorStore()

  const {isShiftKey,keydown,keyup}  =useShiftKey()


  useEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      if(event.shiftKey){
        keydown()
      }
    },
    {
      capture:false,
      once: true,
      passive: false
    })

  useEventListener(
    'keyup',
    (event: KeyboardEvent) => {
      keyup()
    },
    {
      capture:false,
      once: true,
      passive: false
    })
  // 画布容器
  const screenRef = useRef(null)

  const screenshotDomRef = useRef(null)

  // 画布 ref
  const canvasRef = useRef({
    getWrappedInstance: () => Object
  } as any)
  // 第一次加载，如果后端有数据，就加载后端的数据
  useEffect(() => {
    const initData = () => {
      if (editorData && editorData != null && editorData != undefined) {
        // 有数据就初始化
        const newNodes = (editorData?.nodes || []).map((item) => {
          return {
            ...item,
            ref: React.createRef()
          }
        })
        setNodes(newNodes)
        setGroups(editorData.groups)
        setLinks(editorData.links)
        setCanvasProps(editorData.editorConfig)
      }
    }
    const timer = setTimeout(() => {
      initData()
      // 设置初始化就是最新数据，此时退出不需要提示
      setIsSave(true)
      // 清除操作历史
      clear()
    }, 500)
    return () => {
      clearTimeout(timer)
    }
  }, [editorData])
  // 对父组件暴露保存数据的接口
  useImperativeHandle(
    ref,
    () => ({
      handleSaveData: () => {
        const saveDiv = document.getElementById('editor-_toolbarBtnSave')
        saveDiv.click()
        setIsSave(true)
      },
      getIsSave: () => {
        return isSave
      }
    }),
    [isSave]
  )
  // 设置每五分钟保存一次数据
  useEffect(() => {
    const timer = setTimeout(() => {
      const saveDiv = document.getElementById('editor-_toolbarBtnSave')
      if(!isSave) saveDiv.click()
    }, 1000 * 60 * (autoSaveInterval || 1))
    return () => {
      clearTimeout(timer)
    }
  }, [isSave])

  useEffect(()=>{
    const timer = setTimeout(()=>{
      const saveDiv = document.getElementById('toolbar-btn__zoom')
      saveDiv.click()
    },200)
    return () => {
      clearTimeout(timer)
    }
  },[1])

  const canvasInstance = canvasRef.current

  // 保存操作历史
  const handleSetUndoAndRedo  = ()=>{
    setHistory({
      nodes:nodes,
      links:links,
      groups: groups,
      canvasProps:canvasProps
    })
  }
  // 初始化的时候，将后端传过来的数据赋值给前端

  /** 删除组件 */
  const handleDeleteNodes = (ids: string[]) => {
    if (!ids) {
      return
    }
    // 删除与组件相连的连线，不论上游或下游

    const newLinks = _.cloneDeep(links)
    ids.forEach((id) => {
      // 删除与节点连接的任意边
      _.remove(newLinks, (link) => link.source === id || link.target === id)
    })
    // 更新连线
    setLinks(newLinks)

    // 剔除components
    const cloneNodes = _.cloneDeep(nodes)
    const newNodes = _.remove(cloneNodes, (item) => !ids.includes(item.id))

    setNodes(newNodes)
    setIsSave(false)

    // 清空高亮状态
    setSelectedLinks([])
    setSelectedNodes([])
  }

  /** 删除连线 */
  const handleDeleteLinks = (activeLinks: string[]) => {
    if (!activeLinks) {
      return
    }
    const linkList = links.map((link) => link.id)
    const diffLinks = _.difference(linkList, activeLinks)
    const newLinks = diffLinks
      ? diffLinks.map((link) => _.find(links, (item) => item.id === link))
      : []
    setLinks(newLinks)
    setIsSave(false)
  }

  /** 复制节点 */
  const handleNodesCopy = (ids: string[]) => {
    const newCopiedNodes = ids.map((id) => {
      return _.find(nodes, (item) => item.id === id)
    })

    setCopiedNodes(newCopiedNodes)
  }

  /** 粘贴节点 */
  const handleNodesPaste = () => {
    if (copiedNodes) {
      const currentCopied = copiedNodes.map((node) => {
        return {
          ...node,
          id: uuid.v4(),
          /**  @todo 后续可优化布局算法 */
          x: node.x + node.width + 20,
          ref: React.createRef()
        }
      })
      setCopiedNodes(currentCopied)
      setNodes([...nodes, ...currentCopied])
      setIsSave(false)
    }
  }

  // 剪切
  const handleShear = () => {
    if (selectedNodes) {
      handleNodesCopy(selectedNodes)
      handleDeleteNodes(selectedNodes)
      setIsSave(false)
    }
  }

  // 复制
  const handleCopy = () => {
    if (selectedNodes) {
      handleNodesCopy(_.compact(selectedNodes))
    }
  }

  // 粘贴
  const handlePaste = () => {
    if (copiedNodes) {
      handleNodesPaste()
      _getSelectedRealNodes().map((node) => {
        nodes.push(node)
      })
      setIsSave(false)
    }
  }

  // 删除节点
  const handleDelete = () => {
    if (selectedNodes) {
      handleDeleteNodes(selectedNodes)
      // 判断删除的节点是否在组内，删除组内的节点
      const newGroups = groups.map((group) => {
        selectedNodes.forEach((id) => {
          const index = _.findIndex(group?.nodes, (node) => node.id === id)
          if (index > -1) {
            group.nodes = [
              ...group.nodes.slice(0, index),
              ...group.nodes.slice(index + 1)
            ]
            group = handleGroupInfo(group.nodes)
          }
        })
        return group
      })
      setGroups(_.compact(newGroups))
    }
    if (selectedLinks) {
      handleDeleteLinks(selectedLinks)
    }
  }
  // 将节点上移一层或者下移一层
  const handleBringUp = () => {
    if (selectedNodes) {
      const nodeIndexs = selectedNodes.map(nodeId=>{
        return _.findIndex(nodes,item=>item.id===nodeId)
      })
      const newNodes = _.cloneDeep(nodes);
      const nodesLength = nodes.length;
      nodeIndexs.map(nodeIndex=>{
        let nodeTemp = newNodes[nodeIndex]
        if((nodeIndex+1)<nodesLength){
          newNodes[nodeIndex] = newNodes.splice(nodeIndex+1,1,nodeTemp)[0]
        }
        return null;
      })
      setNodes(newNodes)
    }
  }
  const handleBringDown = () => {
    if (selectedNodes) {
      const nodeIndexs = selectedNodes.map(nodeId=>{
        return _.findIndex(nodes,item=>item.id===nodeId)
      })
      let newNodes = _.cloneDeep(nodes);
      nodeIndexs.map(nodeIndex=>{
        let nodeTemp = newNodes[nodeIndex]
        if(nodeIndex<1) return null;
        newNodes[nodeIndex] = newNodes.splice(nodeIndex-1,1,nodeTemp)[0]
        return newNodes;
      })
      setNodes(newNodes)
    }
  }
  const handleBringTop = () => {
    if (selectedNodes) {
      const nodeIndexs = selectedNodes.map(nodeId=>{
        return _.findIndex(nodes,item=>item.id===nodeId)
      })
      let newNodes = _.cloneDeep(nodes);
      nodeIndexs.map(nodeIndex=>{
        if(nodeIndex+1>nodes.length) return null;
        newNodes.push(newNodes.splice(nodeIndex,1)[0])
        return newNodes;
      })
      setNodes(newNodes)
    }
  }
  const handleBringBottom = () => {
    if (selectedNodes) {
      const nodeIndexs = selectedNodes.map(nodeId=>{
        return _.findIndex(nodes,item=>item.id===nodeId)
      })
      let newNodes = _.cloneDeep(nodes);
      nodeIndexs.map(nodeIndex=>{
        if(nodeIndex<1) return null;
        newNodes.unshift(newNodes.splice(nodeIndex,1)[0])
        return newNodes;
      })
      setNodes(newNodes)
    }
  }

  const _getSelectedRealNodes = () => {
    return selectedNodes.map((nodeId) => {
      const node = _.find(nodes, (item) => item.id === nodeId)
      return node
    })
  }

  // 左侧对齐
  const handleLeftJustify = () => {
    if (selectedNodes) {
      // 只有一个元素就不处理
      if (selectedNodes.length == 1) return
      const selectedRealNodes = _getSelectedRealNodes()
      selectedRealNodes.map((currNode, index) => {
        if (index > 0) {
          currNode.x = selectedRealNodes[0].x
          updateNodes(currNode)
        }
        return currNode
      })
    }
  }
  // 水平居中
  const handleHorizontallyJustify = () => {
    if (selectedNodes) {
      // 只有一个元素就不处理
      if (selectedNodes.length == 1) return
      const selectedRealNodes = _getSelectedRealNodes()
      selectedRealNodes.map((currNode, index) => {
        if (index > 0) {
          currNode.x =
            selectedRealNodes[0].x +
            Math.round(selectedRealNodes[0].width / 2) -
            Math.round(currNode.width / 2)
          updateNodes(currNode)
        }
        return currNode
      })
    }
  }
  // 右侧对齐
  const handleRightJustify = () => {
    if (selectedNodes) {
      // 只有一个元素就不处理
      if (selectedNodes.length == 1) return
      const selectedRealNodes = _getSelectedRealNodes()
      selectedRealNodes.map((currNode, index) => {
        if (index > 0) {
          currNode.x =
            selectedRealNodes[0].x + selectedRealNodes[0].width - currNode.width
          updateNodes(currNode)
        }
        return currNode
      })
    }
  }
  // 顶部对齐
  const handleTopJustify = () => {
    if (selectedNodes) {
      // 只有一个元素就不处理
      if (selectedNodes.length == 1) return
      const selectedRealNodes = _getSelectedRealNodes()
      selectedRealNodes.map((currNode, index) => {
        if (index > 0) {
          currNode.y = selectedRealNodes[0].y
          updateNodes(currNode)
        }
        return currNode
      })
    }
  }
  // 垂直居中
  const handleVerticallyJustify = () => {
    if (selectedNodes) {
      // 只有一个元素就不处理
      if (selectedNodes.length == 1) return
      const selectedRealNodes = _getSelectedRealNodes()
      selectedRealNodes.map((currNode, index) => {
        if (index > 0) {
          currNode.y =
            selectedRealNodes[0].y +
            Math.round(selectedRealNodes[0].height / 2) -
            Math.round(currNode.height / 2)
          updateNodes(currNode)
        }
        return currNode
      })
    }
  }
  // 底部对齐
  const handleBottomJustify = () => {
    if (selectedNodes) {
      // 只有一个元素就不处理
      if (selectedNodes.length == 1) return
      const selectedRealNodes = _getSelectedRealNodes()
      selectedRealNodes.map((currNode, index) => {
        if (index > 0) {
          currNode.y =
            selectedRealNodes[0].y -
            currNode.height +
            selectedRealNodes[0].height
          updateNodes(currNode)
        }
        return currNode
      })
    }
  }

  // 圈选
  const handleDragSelect = () => {
    setDragSelectable(!dragSelectable)
  }

  // 预览
  const handlePreview = () => {
    // 编辑器内默认的预览按钮,在内打开一个全屏的弹出窗口
    if (onPreview) {
      const localEditorData = {
        nodes,
        links,
        groups,
        editorConfig: canvasProps
      }
      onPreview(localEditorData)
    } else {
      setIsShowPreviewModel(!isShowPreviewModel)
    }
  }

  /** 处理DragSelector 关闭事件 */
  // 处理圈选事件
  const onDragSelectorClose = (selectorProps: ShapeProps) => {
    // 计算区域内的位置有多少节点需要高亮,其实计算的是一个点是否在矩形内

    // 1. 计算每个节点的中心
    // 多边形的位置信息要与画布同步
    const { k, x, y } = currTrans

    const points = nodes.map((node) => {
      return {
        x: k * node.x + x + (node.width / 2) * k,
        y: k * node.y + y + (node.height / 2) * k,
        id: node.id
      }
    })
    // 2. 多边形各个点转化为数组，暂时为矩形，后面考虑其他形状
    let poly = []
    if (selectorProps.direction === 'left') {
      poly = [
        { x: selectorProps.x, y: selectorProps.y },
        { x: selectorProps.x + selectorProps.width, y: selectorProps.y },
        {
          x: selectorProps.x + selectorProps.width,
          y: selectorProps.y + selectorProps.height
        },
        { x: selectorProps.x, y: selectorProps.y + selectorProps.height }
      ]
    } else {
      poly = [
        { x: selectorProps.x, y: selectorProps.y },
        { x: selectorProps.x - selectorProps.width, y: selectorProps.y },
        {
          x: selectorProps.x - selectorProps.width,
          y: selectorProps.y - selectorProps.height
        },
        { x: selectorProps.x, y: selectorProps.y - selectorProps.height }
      ]
    }

    // 3. 射线法判断点是否在多边形的内部
    const ids = points.map((point) => {
      if (pointInPoly(point, poly) === 'in') {
        return point.id
      }
    })
    setSelectedNodes(_.compact(ids))
    setDragSelectable(false)
  }

  /** 保存 */
  const handleSave = async () => {
    const data = await handleSaveData()
    const editorData = {
      nodes,
      links,
      groups,
      editorConfig: canvasProps
    }
    if (data) {
      message.success('保存成功')
    } else {
      message.error('保存失败')
    }
    // 生成缩略图
    getScreenShot(editorData)
  }
  // 获得编辑器内的缩略图
  const getScreenShot = (editorData) => {
    const screenshotDom = screenshotDomRef?.current
    return getScreenshot(screenshotDom, '截图', { useCORS: true, logging: true }).then((canvas) => {
      const dataURL = canvas.toDataURL('image/png')
      const blob = dataURL2Blob(dataURL)
      const file = new File([blob], '截图.png', { type: 'image/png' })
      const data = {
        data: editorData,
        screenshot:file
      }
      onEditorSaveCb && onEditorSaveCb(data)
      // const api = axios.create({ headers: { 'Content-Type': 'multipart/form-data' } })
      // const formData = new FormData()
      // api.defaults.headers.common['token'] = window.localStorage.getItem('access_token')
      // formData.append('file', file)
      // formData.append('mappingId', "1a99aa5c58144a7b8ce8230ace2c53b6")
      // formData.append('mappingType', "100")
      // api.post(`http://qt.test.bicisims.com/api/file/file/upload`, formData).then(res=>{
      //   console.log(res)
      // })

    })
  }
  /** 退出，要检查是否已经保存 */
  const handlePoweroff = () => {
    onPoweroff && onPoweroff()
  }

  /** 计算选中节点的位置，形成大的group */
  const handleGroupInfo = (nodes: Node[]): Group => {
    if (!nodes) {
      return
    }
    const minXNode = _.minBy(nodes, (node) => node.x)
    const minYNode = _.minBy(nodes, (node) => node.y)

    const maxXNode = _.maxBy(nodes, (node) => node.x + node.width)
    const maxYNode = _.maxBy(nodes, (node) => node.y + node.height)

    const x = minXNode?.x - GROUP_PADDING
    const y = minYNode?.y - GROUP_PADDING

    const minXId = minXNode?.id
    const maxYId = maxYNode?.id

    const width = maxXNode?.x + maxXNode?.width - x + GROUP_PADDING
    const height = maxYNode?.y + maxYNode?.height - y + GROUP_PADDING

    if (minXId && maxYId) {
      return {
        id: `group_${minXId}_${maxYId}`,
        x,
        y,
        width,
        height,
        nodes: nodes.map((node) => ({
          ...node,
          groupId: `group_${minXId}_${maxYId}`
        })),
        ref: React.createRef()
      }
    }
  }

  /** 更新组的数据 */
  const updateGroupsInfo = (
    currentNodes: Node[],
    type = 'merge' as 'merge' | 'new', // 区分是合并还是新组
    deleteGroupId?: string
  ) => {
    const newGroup = handleGroupInfo(currentNodes)
    if (newGroup) {
      // 更新节点
      const groupId = newGroup.id
      const groupNodes = newGroup.nodes.map((node) => ({ ...node, groupId }))
      // 原来的groupId
      const originGroupId = currentNodes[0].groupId
      // 更新节点
      const newNodes = nodes.map((node) => {
        const groupNode = _.find(groupNodes, (item) => item.id === node.id)
        if (groupNode) {
          return groupNode
        } else {
          const { groupId, ...newNode } = node
          return newNode
        }
      })

      setNodes(newNodes)

      let newGroups =
        type === 'merge'
          ? groups.filter((group) => group.id !== originGroupId)
          : groups

      if (type === 'merge' && newGroups && newGroups.length > 0) {
        newGroups = newGroups.map((group) => {
          return group.id === newGroup.id ? newGroup : group
        })
      } else {
        newGroups.push(newGroup)
      }

      // let newGroups = _.uniqBy(_.compact([...groups, newGroup]), "id");
      if (deleteGroupId) {
        newGroups = newGroups.filter((group) => group.id !== deleteGroupId)
      }
      setGroups(newGroups)
    } else {
      if (deleteGroupId) {
        const newGroups = groups.filter((group) => group.id !== deleteGroupId)
        setGroups(newGroups)
      }
    }
  }

  /** 成组 */
  const handleGroup = () => {
    const currentNodes = _.compact(
      nodes.map((node) => {
        if (selectedNodes.includes(node.id)) {
          return node
        }
      })
    )
    // 更新组
    updateGroupsInfo(currentNodes, 'new')
    setSelectedNodes([])
  }
  /** 解组 */
  const handleUnGroup = () => {
    const newGroups = (groups||[]).filter(group=>{
      if(selectedGroup==undefined) return true;
      return group.id != selectedGroup.id
    })
    setGroups(newGroups)
  }
  const handleUndo = () => {
    undo()
    console.log(stateHistory)
    stateHistory.present&&setNodes(stateHistory.present.nodes)

  }
  const handleRedo = () => {
      redo()
    console.log(stateHistory)
    stateHistory.present&&setNodes(stateHistory.present.nodes)
  }
  // 渲染额外的node
  const handleExtraRender = () => {
    onExtraSetting && onExtraSetting()
  }

  useKeyPress(
    'delete',
    () => {
      if (document.activeElement.tagName === 'BODY') {
        handleDelete()
      }
    },
    {
      events: ['keydown','keyup']
    }
  )


  const isMac = navigator.platform.startsWith('Mac')

  useKeyPress(isMac ? ['meta.x'] : ['ctrl.x'], () => {
    handleShear()
  })

  useKeyPress(isMac ? ['meta.c'] : ['ctrl.c'], () => {
    handleCopy()
  })

  useKeyPress(isMac ? ['meta.v'] : ['ctrl.v'], () => {
    handlePaste()
  })
  useKeyPress(isMac ? ['meta.s'] : ['ctrl.s'], (event) => {
    event.returnValue=false;
    handleSave()
  })
  useKeyPress(isMac ? ['meta.f12'] : ['ctrl.f12'], (event) => {
    event.returnValue=false;
    handlePreview()
  })
  useKeyPress(isMac ? ['meta.g'] : ['ctrl.g'], (event) => {
    event.returnValue=false;
    handleGroup()
  })
  useKeyPress(isMac ? ['meta.u'] : ['ctrl.u'], (event) => {
    event.returnValue=false;
    handleUnGroup()
  })

  useEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      const SUPER_KEY_CODE = navigator.platform.startsWith('Mac')
        ? event.metaKey
        : event.ctrlKey
      if (SUPER_KEY_CODE) {
        setKeyPressing(true)
      }
    },
    canvasInstance
  )

  useEventListener(
    'keyup',
    (event: KeyboardEvent) => {
      setKeyPressing(false)
    },
    canvasInstance
  )
  /** 操作区 */
  const renderOperation = (
    <div>
      <Toolbar

        ref={screenRef}
        showIsSave={isSave}
        screenScale={screenScale}
        changeScreenScale={changeScreenScale}
        handleResizeTo={canvasInstance && canvasInstance.handleResizeTo}
        handleScreenResizeTo={
          canvasInstance && canvasInstance.handleScreenResizeTo
        }
        items={[
          'save',
          'fullscreen',
          'zoom',
          'format',
          'ratio',
          'shear',
          'copy',
          'paste',
          'group',
          'ungroup',
          'preview',
          'bringUp',
          'bringDown',
          'bringTop',
          'bringBottom',
          'undo',
          'redo',
          'poweroff',
          'extraRender',
        ]}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onDelete={handleDelete}
        onShear={handleShear}
        onDragSelect={handleDragSelect}
        onSave={handleSave}
        onPoweroff={handlePoweroff}
        onLayout={canvasInstance && canvasInstance.layout}
        onAdapt={canvasInstance && canvasInstance.handleShowAll}
        onGroup={handleGroup}
        onUnGroup={handleUnGroup}
        onPreview={handlePreview}
        onBringUp={handleBringUp}
        onBringDown={handleBringDown}
        onBringBottom={handleBringBottom}
        onBringTop={handleBringTop}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onLeftJustify={handleLeftJustify}
        onVerticallyJustify={handleVerticallyJustify}
        onTopJustify={handleTopJustify}
        onRightJustify={handleRightJustify}
        onBottomJustify={handleBottomJustify}
        onHorizontallyJustify={handleHorizontallyJustify}
        onExtraRender={handleExtraRender}
      />
    </div>
  )
  /** 渲染节点选择区 */
  const renderNodePanel = (
    <ResizePanel direction="e" style={{ width: '319px' }}>
      <NodePanel
        onDrag={setDragNode}
        industrialLibrary={industrialLibrary}
        selfIndustrialLibrary={selfIndustrialLibrary}
        config={uploadConfig.self}
      />
    </ResizePanel>
  )
  // 渲染本地预览框
  const renderPreviewModel = () => {
    const localEditorData = {
      nodes,
      links,
      groups,
      editorConfig: canvasProps
    }
    return (
      <Modal
        title='预览'
        className='preview-modal'
        visible={isShowPreviewModel}
        onOk={handlePreview}
        onCancel={handlePreview}
        okText='确认'
        cancelText='取消'
      >
        <DataVPreview editorData={localEditorData} />
      </Modal>
    )
  }

  /** 渲染中间画布区 */
  const renderCanvas = (
    <div className='editor-canvas'>
      <DragSelector
        visible={dragSelectable}
        getPopupContainer={() => document.querySelector('.editor-canvas')}
        overlayColor='rgba(0,0,0,0.1)'
        selectorStyle={{
          fill: 'transparent',
          strokeWidth: 1,
          stroke: '#6ca0f5',
          strokeDasharray: '5 5'
        }}
        onClose={onDragSelectorClose}
      />
      <CanvasContent
        dragNode={dragNode}
        ref={canvasRef}
        nodes={nodes}
        links={links}
        groups={groups}
        setNodes={setNodes}
        setLinks={setLinks}
        selectedLinks={selectedLinks}
        setSelectedLinks={setSelectedLinks}
        selectedNodes={selectedNodes}
        setGroups={setGroups}
        setSelectedNodes={setSelectedNodes}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        updateNodes={updateNodes}
        updateLinks={updateLinks}
        deleteNodes={handleDeleteNodes}
        deleteLinks={handleDeleteLinks}
        copiedNodes={copiedNodes}
        setCopiedNodes={setCopiedNodes}
        currTrans={currTrans}
        setCurrTrans={setCurrTrans}
        isKeyPressing={keyPressing}
        updateGroups={updateGroupsInfo}
        canvasStyle={canvasProps}
        onEditNode={handleAutoSaveSettingInfo}
        setHistory={setHistory}
        isShiftKey={isShiftKey}
        onSetUndoAndRedo={handleSetUndoAndRedo}
      />
    </div>
  )
  return (
    <React.Fragment>
      <div className="screenshotDom" style={{display:'none'}} ref={screenshotDomRef}></div>
      <div className='editor-demo' ref={screenRef}>
        <div className='editor-operation'>{renderOperation}</div>
        <div className='editor-container'>
          {renderNodePanel}
          {renderCanvas}
          <RenderPropertySidebar
            selectedNodes={selectedNodes}
            canvasProps={canvasProps}
            setCanvasProps={setCanvasProps}
            nodes={nodes}
            groups={groups}
            links={links}
            updateNodes={updateNodes}
            setDragNode={setDragNode}
            autoSaveSettingInfo={handleAutoSaveSettingInfo}
            config={uploadConfig.preInstall}
            preInstallBgImages={preInstallBgImages}
            onLeftJustify={handleLeftJustify}
            onVerticallyJustify={handleVerticallyJustify}
            onTopJustify={handleTopJustify}
            onRightJustify={handleRightJustify}
            onBottomJustify={handleBottomJustify}
            onHorizontallyJustify={handleHorizontallyJustify}
          />
        </div>
      </div>
      {isShowPreviewModel && renderPreviewModel()}
    </React.Fragment>
  )
})

export default DataVEditor
