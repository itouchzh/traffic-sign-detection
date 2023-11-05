import { Suspense, lazy } from 'react'
import { Navigate } from 'react-router-dom'
// import About from '@/views/About'
// import Home from '@/views/Home'
// 懒加载
// const About = lazy(() => import('@/views/About'))
import Loading from '@/views/Loading/Loading'
const Home = lazy(() => import('@/views/Home/Home'))
const Login = lazy(() => import('@/views/Login/Login'))
const User = lazy(() => import('@/views/User/User'))
const Detection = lazy(() => import('@/views/Detection/Detection'))
const Results = lazy(() => import('@/views/Results/Results'))
const ErrorPage = lazy(() => import('@/views/ErrorPage/Error'))
const CommonButton = lazy(() => import('@/views/CommonCom/button/index'))
const CommonWatermark = lazy(() => import('@/views/CommonCom/watermark/index'))
const Paper = lazy(() => import('@/views/Paper'))

// const Classes = lazy(() => import('@/views/Classes/Classes'))
// const Detection = lazy(() => import('@/views/Detection/Detection/Detection'))
// const Results = lazy(() => import('@/views/Detection/Results/Restults'))

const suspense = (comp: JSX.Element) => <Suspense fallback={<Loading />}>{comp}</Suspense>

const routes = [
    {
        path: '/',
        element: <Navigate to="/login" />,
    },
    {
        path: '/login',
        element: suspense(<Login />),
    },
    // {
    //     path: '/home',
    //     element: suspense(<Home />),
    // },
    {
        path: '/home',
        element: suspense(<Home />),
        children: [
            {
                path: 'user',
                element: suspense(<User />),
            },
            {
                path: 'detection',
                element: suspense(<Detection />),
            },
            {
                path: 'results',
                element: suspense(<Results />),
            },
            {
                path: 'error',
                element: suspense(<ErrorPage />),
            },
            {
                path: 'paper',
                element: suspense(<Paper />),
            },
            {
                path: 'commonComponents',
                // element: suspense(<CommonWatermark />),
                children: [
                    {
                        path: 'button',
                        element: suspense(<CommonButton />),
                    },
                    {
                        path: 'watermark',
                        element: suspense(<CommonWatermark />),
                    },
                ],
            },
        ],
    },
    {
        path: '/*',
        element: suspense(<ErrorPage />),
    },
]
export default routes
