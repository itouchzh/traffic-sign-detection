import { cloneDeep } from 'lodash'
import { report } from '../utils/report'

const next =
    typeof window.requestAnimationFrame === 'function'
        ? requestAnimationFrame
        : (callback: any) => {
              setTimeout(callback, 1000 / 60)
          }

const frames: any = []

export default function fps() {
    let frame = 0
    let lastSecond = Date.now()

    function calculateFPS() {
        frame++ 
        const now = Date.now()
        if (lastSecond + 1000 <= now) {
            // 由于 now - lastSecond 的单位是毫秒，所以 frame 要 * 1000
            const fps = Math.round((frame * 1000) / (now - lastSecond))
            frames.push(fps)
            frame = 0
            lastSecond = now
        }

        // 避免上报太快，缓存一定数量再上报
        if (frames.length >= 60) {
            // console.log({
            //     frames,
            //     type: 'performace',
            //     subType: 'fps',
            // })
            // report(
            //     cloneDeep({
            //         frames,
            //         type: 'performace',
            //         subType: 'fps',
            //     })
            // )
            frames.length = 0
        }

        next(calculateFPS)
    }

    calculateFPS()
}

export function isBlocking(fpsList: any, below = 20, last = 3) {
    let count = 0
    for (let i = 0; i < fpsList.length; i++) {
        if (fpsList[i] && fpsList[i] < below) {
            count++
        } else {
            count = 0
        }

        if (count >= last) {
            return true
        }
    }

    return false
}
