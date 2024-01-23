import { originalOpen, originalSend } from './xhr'
import { addCache, getCache, clearCache } from './cache'
import generateUniqueID from './generateUnique'
import config from '../config'
import overWriteSendBeacon from '../performance/sendBeacon'

export function isSupportSendBeacon() {
    const isSupported = !!window.navigator?.sendBeacon

    if (isSupported) {
        overWriteSendBeacon()
    }

    return isSupported
}

const sendBeacon = isSupportSendBeacon() ? window.navigator.sendBeacon.bind(window.navigator) : reportWithXHR
const sessionID = generateUniqueID()
export function report(data: any, isImmediate = false) {
    const url = config.url
    const blobData = new Blob(
        [
            JSON.stringify({
                data,
            }),
        ],
        { type: 'application/json' }
    )

    if (isImmediate) {
        sendBeacon(url, blobData)
        return
    }

    if (window.requestIdleCallback) {
        window.requestIdleCallback(
            () => {
                sendBeacon(url, blobData)
            },
            { timeout: 3000 }
        )
    } else {
        setTimeout(() => {
            sendBeacon(url, blobData)
        })
    }
}

let timer: any = null
export function lazyReportCache(data: any, timeout = 3000) {
    addCache(data)
    clearTimeout(timer)
    timer = setTimeout(() => {
        const data = getCache()
        if (data.length) {
            report(data)
            clearCache()
        }
    }, timeout)
}

export function reportWithXHR(data: any) {
    const xhr = new XMLHttpRequest()
    originalOpen.call(xhr, 'post', config.url, true)
    originalSend.call(xhr, JSON.stringify(data))
}
