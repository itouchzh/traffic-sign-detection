import { originalOpen, originalSend, originalProto } from '../utils/xhr'
import { lazyReportCache } from '../utils/report'

function overwriteOpenAndSend() {
    originalProto.open = function newOpen(this: any, ...args: any) {
        this.url = args[1]
        this.method = args[0]
        originalOpen.apply(this, args)
    } as any
    originalProto.send = function newSend(this: any, ...args) {
        this.startTime = Date.now()
        const onLoadend = () => {
            this.endTime = Date.now()
            this.duration = this.endTime - this.startTime
            const { status, duration, startTime, endTime, url, method } = this as any
            const reportData = {
                status,
                duration,
                startTime,
                endTime,
                url,
                method: (method || 'GET').toUpperCase(),
                success: status >= 200 && status < 300,
                subType: 'xhr',
                type: 'performance',
            }
            console.log('监听到xhr请求',reportData)

            // lazyReportCache(reportData)

            this.removeEventListener('loadend', onLoadend, true)
        }

        this.addEventListener('loadend', onLoadend, true)
        originalSend.apply(this, args)
    }
}

export default function xhr() {
    overwriteOpenAndSend()
}
