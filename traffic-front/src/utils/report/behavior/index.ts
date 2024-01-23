import pv from './pv'
import pageAccessDuration from './pageAccessDuration'
import pageAccessHeight from './pageAccessHeight'
import onClick from './onClick'
import pageChange from './pageChange'

export default function behavior() {
    // 页面浏览量
    pv()
    // 页面停留时长
    pageAccessDuration()
    // 页面访问深度
    // pageAccessHeight()
    // // 用户点击
    onClick()
    // // 页面跳转
    pageChange()
}
