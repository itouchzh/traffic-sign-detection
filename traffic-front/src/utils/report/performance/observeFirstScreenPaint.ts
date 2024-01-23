import { executeAfterLoad, getPageURL } from '../utils/utils'
import { isLCPDone } from './observeLCP'
import { lazyReportCache } from '../utils/report'

let isOnLoaded = false
executeAfterLoad(() => {
    isOnLoaded = true
})

let timer: any
let observer: any
function checkDOMChange() {
    clearTimeout(timer)
    timer = setTimeout(() => {
        // 等 load、lcp 事件触发后并且 DOM 树不再变化时，计算首屏渲染时间
        if (isOnLoaded && isLCPDone()) {
            observer && observer.disconnect()
            // console.log({
            //     type: 'performance',
            //     subType: 'first-screen-paint',
            //     startTime: getRenderTime(),
            //     pageURL: getPageURL(),
            // })
            lazyReportCache({
                type: 'performance',
                subType: 'first-screen-paint',
                startTime: getRenderTime(),
                pageURL: getPageURL(),
            })
            entries = []
            isOnLoaded = false
        } else {
            checkDOMChange()
        }
    }, 500)
}

let entries: any = []
export default function observeFirstScreenPaint() {
    if (!MutationObserver) return

    const next = typeof window.requestAnimationFrame === 'function' ? requestAnimationFrame : setTimeout

    const ignoreDOMList = ['STYLE', 'SCRIPT', 'LINK', 'META']
    observer = new MutationObserver((mutationList) => {
        checkDOMChange()
        const entry: {
            startTime: number
            children: any[]
        } = {
            startTime: 0,
            children: [],
        }

        next(() => {
            entry.startTime = performance.now()
        })

        for (const mutation of mutationList) {
            if (mutation.addedNodes.length) {
                for (let node of Array.from(mutation.addedNodes)) {
                    let newNode: any = node
                    if (
                        node.nodeType === 1 &&
                        !ignoreDOMList.includes(newNode.tagName) &&
                        !isInclude(node, entry.children)
                    ) {
                        entry.children.push(newNode)
                    }
                }
            }
        }

        if (entry.children.length) {
            entries.push(entry)
        }
    })

    observer.observe(document, {
        childList: true,
        subtree: true,
    })
}

function getRenderTime() {
    let startTime = 0

    entries.forEach((entry: any) => {
        for (const node of entry.children) {
            if (isInScreen(node) && entry.startTime > startTime && needToCalculate(node)) {
                startTime = entry.startTime
                break
            }
        }
    })

    // 需要和当前页面所有加载图片的时间做对比，取最大值
    // 图片请求时间要小于 startTime，响应结束时间要大于 startTime
    performance.getEntriesByType('resource').forEach((item: any) => {
        if (item.initiatorType === 'img' && item.fetchStart < startTime && item.responseEnd > startTime) {
            startTime = item.responseEnd
        }
    })

    return startTime
}

function needToCalculate(node: any) {
    // 隐藏的元素不用计算
    if (window.getComputedStyle(node).display === 'none') return false

    // 用于统计的图片不用计算
    if (node.tagName === 'IMG' && node.width < 2 && node.height < 2) {
        return false
    }

    return true
}

function isInclude(node: any, arr: any): boolean {
    if (!node || node === document.documentElement) {
        return false
    }

    if (arr.includes(node)) {
        return true
    }

    return isInclude(node.parentElement, arr)
}

const viewportWidth = window.innerWidth
const viewportHeight = window.innerHeight

// dom 对象是否在屏幕内
function isInScreen(dom: any) {
    const rectInfo = dom.getBoundingClientRect()
    if (rectInfo.left >= 0 && rectInfo.left < viewportWidth && rectInfo.top >= 0 && rectInfo.top < viewportHeight) {
        return true
    }
}
