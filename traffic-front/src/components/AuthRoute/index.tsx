import React, { useEffect } from 'react'
import { Navigate, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/state/store'
import { useAuthContext } from '@/context/authContext'
import { getLocalStorage } from '@/utils/storage'
import { lazyReportCache } from '@/utils/report/utils/report'
import { getUUID } from '@/utils/report/behavior/utils'

const AuthRoute = (props: any) => {
    // 通过菜单鉴权
    const location = useLocation()
    const parmas = useParams()
    lazyReportCache({
        to: location.pathname,
        key: location.key,
        hash: location.hash,
        startTime: performance.now(),
        type: 'behavior',
        subType: 'react-router-change',
        uuid: getUUID(),
    })


    // const menus = useSelector((state: RootState) => state.user.userReducer.user?.menus)
    // const menusList = menus.map((item: any) => '/' + item.path)
    // console.log(menusList)
    // const auth = useAuthContext()
    // if (!auth.user) {
    //     return <Navigate to="/login" />
    // } else if (!menusList.includes(location.pathname)) {
    //     return <Navigate to="/403" />
    // }
    return props.children ? props.children : <Outlet />

    // 通过路由元信息meta鉴权
    // console.log(props)
    // const token = getLocalStorage('token')
    // if (!token) {
    //     return <Navigate to="/login" />
    // }
    // return props.children ? props.children : <Outlet />
}

export default React.memo(AuthRoute)
