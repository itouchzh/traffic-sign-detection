import React, { useEffect, useRef } from 'react'
import dayjs from 'dayjs'

const getRoot = (selector?: string | Element) => {
    if (selector) {
        if (typeof selector === 'string') {
            const dom = document.querySelector(selector)
            if (dom) return dom
        } else if (selector) {
            return selector
        }
    }
    return document.body
}
const waterMarkId = 'water-mark'
/**
 * @param texts 水印的文案
 * @param root 水印插入的位置
 * @returns
 */

const create = (texts: string[], root: Element) => {
    const dpr = window.devicePixelRatio
    const width = 400 * dpr
    const height = 300 * dpr
    const fontSize = 18
    const rotate = -30
    const parentRect = root.getBoundingClientRect()

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
        return ''
    }

    ctx.translate(width / 2, height / 2)
    ctx.rotate((rotate * Math.PI) / 180)
    ctx.translate(-width / 2, -height / 2)

    ctx.font = `${fontSize}px Verdana`
    ctx.fillStyle = '#f5f5f5'

    // 设置上下左右居中
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    // 为避免多行文本重叠到一块
    const half = Math.floor(texts.length / 2)
    texts.push(dayjs().format('YYYY/MM/DD HH:mm:ss'))
    texts.forEach((text, index) => {
        const diff = (fontSize + 5) * Math.abs(index - half)
        const y = index <= half ? height / 2 - diff : height / 2 + diff
        ctx.fillText(text, width / 2, y)
    })

    // 这里为了可以直接使用，就把样式写在了js中，您也可以把样式单独提取出来
    const style: any = {
        // top: 0,
        // left: 0,
        width: `${parentRect.width}px`,
        height: `${parentRect.height}px`,
        'background-image': `url(${canvas.toDataURL('image/png')})`, // 将生成的图片作为背景图
        // 'background-repeat': 'repeat-y',
        'background-position': 'center top',
        position: 'absolute',
        'z-index': 99,
        'pointer-events': 'none',
    }
    const cssText = Object.keys(style)
        .map((key) => `${key}: ${(style as any)[key]}`)
        .join(';')

    const waterDom = document.getElementById(waterMarkId)
    if (waterDom) {
        waterDom.parentNode?.removeChild(waterDom)
    }
    const div = document.createElement('div')
    div.id = waterMarkId
    div.style.cssText = cssText

    root.appendChild(div)
    canvas.parentNode?.removeChild(canvas)

    return cssText
}
/**
 * 创建水印
 * @param texts 水印的文案
 * @param selector 水印所在的容器，不传时则默认body
 * @returns 取消监听水印变化的函数
 */
const createWaterMark = (texts: string[], selector?: string | Element) => {
    const root = getRoot(selector)
    const originalCssText = create(texts, root)
    // 监视dom树是否发生变化
    // const observer = new MutationObserver(() => {
    //     const waterMarkDom = document.getElementById(waterMarkId)
    //     if (waterMarkDom) {
    //         const newStyle = waterMarkDom.getAttribute('style')
    //         if (originalCssText !== newStyle) {
    //             waterMarkDom.setAttribute('style', originalCssText)
    //         }
    //     } else {
    //         create(texts, root)
    //     }
    // })
    // observer.observe(root, {
    //     attributes: true,
    //     childList: true,
    //     subtree: true,
    // })
    // return () => {
    //     // 停止监视
    //     observer.disconnect()
    // }
}
const Watermark = () => {
    const divRef = useRef<any>(null)
    console.log(divRef)
    useEffect(() => {
        console.log(divRef.current)
        createWaterMark(['张三 15141661626'], divRef.current)
    }, [])
    return (
        <>
            <div
                ref={divRef}
                className="box"
                style={{ width: '500px', height: '500px', backgroundColor: '#f5f5f5' }}
            ></div>
        </>
    )
}
export default Watermark
