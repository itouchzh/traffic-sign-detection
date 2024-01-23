// 将错误缓存起来，当页面进入后台或关闭前时，将所有的 cache 数据进行上报
import { cloneDeep } from 'lodash'
const cache: any[] = []

export function getCache() {
    return cloneDeep(cache)
}

export function addCache(data: any) {
    cache.push(data)
}

export function clearCache() {
    cache.length = 0
}
