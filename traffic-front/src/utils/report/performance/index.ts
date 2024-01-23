import observeEntries from './observeEntries'
import observePaint from './observePaint'
import observeLCP from './observeLCP'
import observeCLS from './observeCLS'
import observeFID from './observeFID'
import observerLoad from './observerLoad'
import observeFirstScreenPaint from './observeFirstScreenPaint'
import xhr from './xhr'
import fetch from './fetch'
import fps from './fps'
import sendBeacon from './sendBeacon'

export default function performance() {
    // sendBeacon()
    // observeEntries()
    // fp 和 fcp
    observePaint()
    // lcp
    observeLCP()
    observeCLS()
    // observeFID()
    xhr()
    // fetch()
    fps()
    observerLoad()
    // 首屏渲染时间
    observeFirstScreenPaint()
}
