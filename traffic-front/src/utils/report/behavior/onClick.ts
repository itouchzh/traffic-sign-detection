import { lazyReportCache } from '../utils/report'
import { getPageURL } from '../utils/utils'
import { getUUID } from './utils'

export default function onClick() {
    ;['mousedown', 'touchstart'].forEach((eventType) => {
        let timer: any = null
        window.addEventListener(eventType, (event: any) => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                const target: any = event.target
                const { top, left } = target.getBoundingClientRect()
                // console.log({
                //     top,
                //     left,
                //     eventType,
                //     pageHeight: document.documentElement.scrollHeight || document.body.scrollHeight,
                //     scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
                //     type: 'behavior',
                //     subType: 'click',
                //     target: target.tagName,
                //     paths: event.path?.map((item: any) => item.tagName).filter(Boolean),
                //     startTime: event.timeStamp,
                //     pageURL: getPageURL(),
                //     outerHTML: target.outerHTML,
                //     innerHTML: target.innerHTML,
                //     width: target.offsetWidth,
                //     height: target.offsetHeight,
                //     viewport: {
                //         width: window.innerWidth,
                //         height: window.innerHeight,
                //     },
                //     currentTime: new Date().toISOString(),
                //     uuid: getUUID(),
                // })
                lazyReportCache({
                    top,
                    left,
                    eventType,
                    pageHeight: document.documentElement.scrollHeight || document.body.scrollHeight,
                    scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
                    type: 'behavior',
                    subType: 'click',
                    target: target.tagName,
                    paths: event.path?.map((item: any) => item.tagName).filter(Boolean),
                    startTime: event.timeStamp,
                    pageURL: getPageURL(),
                    outerHTML: target.outerHTML,
                    innerHTML: target.innerHTML,
                    width: target.offsetWidth,
                    height: target.offsetHeight,
                    viewport: {
                        width: window.innerWidth,
                        height: window.innerHeight,
                    },
                    uuid: getUUID(),
                })
            }, 500)
        })
    })
}
