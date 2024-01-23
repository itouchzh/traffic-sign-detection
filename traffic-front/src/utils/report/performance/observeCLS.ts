import { isSupportPerformanceObserver } from './utils'
import { getPageURL, onHidden } from '../utils/utils'
import { lazyReportCache } from '../utils/report'
import { cloneDeep } from 'lodash'

export default function observeCLS() {
    if (!isSupportPerformanceObserver()) return

    let sessionValue = 0
    let sessionEntries: any = []
    const cls = {
        subType: 'layout-shift',
        name: 'layout-shift',
        type: 'performance',
        pageURL: getPageURL(),
        value: 0,
        entries: null,
        startTime: 0,
    }

    const entryHandler = (list: any) => {
        for (const entry of list.getEntries()) {
            // Only count layout shifts without recent user input.
            if (!entry.hadRecentInput) {
                const firstSessionEntry = sessionEntries[0]
                const lastSessionEntry = sessionEntries[sessionEntries.length - 1]

                // If the entry occurred less than 1 second after the previous entry and
                // less than 5 seconds after the first entry in the session, include the
                // entry in the current session. Otherwise, start a new session.
                if (
                    sessionValue &&
                    entry.startTime - lastSessionEntry.startTime < 1000 &&
                    entry.startTime - firstSessionEntry.startTime < 5000
                ) {
                    sessionValue += entry.value
                    sessionEntries.push(formatCLSEntry(entry))
                } else {
                    sessionValue = entry.value
                    sessionEntries = [formatCLSEntry(entry)]
                }

                // If the current session value is larger than the current CLS value,
                // update CLS and the entries contributing to it.
                if (sessionValue > cls.value) {
                    cls.value = sessionValue
                    cls.entries = sessionEntries
                    cls.startTime = performance.now()
                    lazyReportCache(cloneDeep(cls))
                }
            }
        }
    }

    const observer = new PerformanceObserver(entryHandler)
    observer.observe({ type: 'layout-shift', buffered: true })

    // if (observer) {
    //     onHidden(() => {
    //         observer.takeRecords().map(entryHandler)
    //     })
    // }
}

function formatCLSEntry(entry: any) {
    const result = entry.toJSON()
    delete result.duration
    delete result.sources

    return result
}
