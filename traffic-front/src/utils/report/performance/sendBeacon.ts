const originalSendBeacon = window.navigator.sendBeacon

function overwriteSendBeacon() {
    window.navigator.sendBeacon = function (url: string | URL, data?: BodyInit | null): boolean {
        const startTime = Date.now()
        const reportData = {
            startTime,
            url,
            subType: 'sendBeacon',
            type: 'performance',
            endTime: 0,
            duration: 0,
            status: false,
        }
        // 调用原始的 sendBeacon 方法
        const result = originalSendBeacon.apply(this, [url, data])
        reportData.endTime = Date.now()
        reportData.duration = reportData.endTime - startTime
        reportData.status = result
        // 在这里可以将 reportData 发送到服务器或进行其他处理
        // console.log(reportData)

        return result
    }
}

export default function sendBeacon() {
    overwriteSendBeacon()
}
