import { isSupportPerformanceObserver } from './utils'
import { getPageURL } from '../utils/utils'
import { lazyReportCache } from '../utils/report'


/**
 * @description 检测fp和fcp
 * @returns 
 */
export default function observePaint() {
    if (!isSupportPerformanceObserver()) return
    
    const entryHandler = (list:any) => {        
        for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
                observer.disconnect()
            }
    
            const json = entry.toJSON()
            delete json.duration
            const reportData = {
                ...json,
                subType: entry.name,
                type: 'performance',
                pageURL: getPageURL(),
            }

            lazyReportCache(reportData)
        }
    }
    
    const observer = new PerformanceObserver(entryHandler)
    observer.observe({ type: 'paint', buffered: true })
}