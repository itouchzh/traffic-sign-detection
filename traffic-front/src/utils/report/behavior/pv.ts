import { lazyReportCache } from '../utils/report'
import { getUUID } from './utils'
import { getPageURL } from '../utils/utils'

export default function pv() {
    // 页面浏览量
    lazyReportCache({
        type: 'behavior',
        subType: 'pv',
        startTime: performance.now(),
        pageURL: getPageURL(),
        referrer: document.referrer,
        uuid: getUUID(),
    })
}
