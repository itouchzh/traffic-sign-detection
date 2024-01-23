import { lazyReportCache } from '../utils/report'
import { getPageURL } from '../utils/utils'

export default function error() {
    // 捕获自定义错误
    const oldConsoleError = window.console.error
    window.console.error = (...args) => {
        oldConsoleError.apply(window.console, args)
        lazyReportCache({
            occurrenceTime: new Date().getTime(),
            type: 'error',
            subType: 'console-error',
            startTime: performance.now(),
            errData: args.join(' '),
            pageURL: getPageURL(),
        })
    }

    // 捕获资源加载失败错误 js css img...
    window.addEventListener(
        'error',
        (e: any) => {
            const target: any = e.target
            if (!target) return

            if (target.src || target.href) {
                const url = target.src || target.href
                lazyReportCache({
                    occurrenceTime: new Date(),
                    url,
                    type: 'error',
                    subType: 'resource',
                    startTime: e.timeStamp,
                    html: target.outerHTML,
                    resourceType: target.tagName,
                    paths: e.path.map((item: any) => item.tagName).filter(Boolean),
                    pageURL: getPageURL(),
                })
            }
        },
        true
    )

    // 监听 js 错误
    window.onerror = (msg, url, line, column, error: any) => {
        lazyReportCache({
            occurrenceTime: new Date(),
            msg,
            line,
            column,
            error: error.stack,
            subType: 'js',
            pageURL: url,
            type: 'error',
            startTime: performance.now(),
        })
    }

    // 监听 promise 错误 缺点是获取不到列数据
    window.addEventListener('unhandledrejection', (e) => {
        lazyReportCache({
            occurrenceTime: new Date().getTime(),
            reason: e.reason?.stack,
            subType: 'promise',
            type: 'error',
            startTime: e.timeStamp,
            pageURL: getPageURL(),
        })
    })
}
