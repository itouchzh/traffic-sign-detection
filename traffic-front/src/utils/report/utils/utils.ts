export function onBeforeunload(callback: () => void) {
    window.addEventListener('beforeunload', callback, true)
}

export function onHidden(callback: any, once: boolean) {
    const onHiddenOrPageHide = (event: any) => {
        if (event.type === 'pagehide' || document.visibilityState === 'hidden') {
            callback(event)
            if (once) {
                window.removeEventListener('visibilitychange', onHiddenOrPageHide, true)
                window.removeEventListener('pagehide', onHiddenOrPageHide, true)
            }
        }
    }

    window.addEventListener('visibilitychange', onHiddenOrPageHide, true)
    window.addEventListener('pagehide', onHiddenOrPageHide, true)
}
// 在页面加载完成后执行回调函数
export function executeAfterLoad(callback: () => void) {
    if (document.readyState === 'complete') {
        callback()
    } else {
        const onLoad = () => {
            callback()
            window.removeEventListener('load', onLoad, true)
        }

        window.addEventListener('load', onLoad, true)
    }
}

export function getPageURL() {
    return window.location.href
}
