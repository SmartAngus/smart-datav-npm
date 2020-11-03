/**
 * @File: 截图工具
 */

import html2canvas from 'html2canvas'

/**
 * 转换工具, dataURL 转 Blob
 */
export const dataURL2Blob = base64Data => {
  let byteString = ''
  if (base64Data.split(',')[0].indexOf('base64') >= 0) {
    byteString = window.atob(base64Data.split(',')[1])
  } else {
    byteString = unescape(base64Data.split(',')[1])
  }
  const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0]
  let ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ia], {
    type: mimeString
  })
}
/**
 * 获取截图
 *
 * @param {element} dom 截图dom
 * @param {string} name 截图名称
 * @param {object} options 覆盖html2canvas配置
 */
const getScreenshot = (dom, name, options) => {
  let canvas = document.createElement('canvas')
  const width = dom.clientWidth
  const height = dom.clientHeight
  const scale = 1 // canvas放大倍数，倍数越高清晰度越高
  canvas.width = width * scale
  canvas.height = height * scale
  canvas.style.width = dom.clientWidth * scale + 'px'
  canvas.style.height = dom.clientHeight * scale + 'px'
  const ctx = canvas.getContext('2d')
  ctx.scale(scale, scale)
  // 去掉锯齿
  ctx.imageSmoothingEnabled = false
  const defaultOptions = {
    canvas,
    scale,
    width,
    height,
    onrendered: canvas => {}
  }
  const distOptions = {...defaultOptions, ...options}
  return html2canvas(dom, distOptions)
}

export { getScreenshot }
