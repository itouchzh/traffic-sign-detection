import { Suspense, lazy } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'

// import About from '@/views/About'
// import Home from '@/views/Home'
// 懒加载
// const About = lazy(() => import('@/views/About'))
import Loading from '@/views/Loading/Loading'
import AuthRoute from '@/components/AuthRoute'
import ForbiddenPage from '@/views/ErrorPage/403Page'
const Home = lazy(() => import('@/views/Home/Home'))
const Login = lazy(() => import('@/views/Login/Login'))
const User = lazy(() => import('@/views/User/User'))
const Detection = lazy(() => import('@/views/Detection/Detection'))
const DetectionVideo = lazy(() => import('@/views/Detection/DetectionVideo'))
const DetectionStream = lazy(() => import('@/views/Detection/DetectionStream'))
const Results = lazy(() => import('@/views/Results/Results'))
const ErrorPage = lazy(() => import('@/views/ErrorPage/Error'))
const CommonButton = lazy(() => import('@/views/CommonCom/button/index'))
const CommonWatermark = lazy(() => import('@/views/CommonCom/watermark/index'))
const Paper = lazy(() => import('@/views/Paper'))
const FormDesignPage = lazy(() => import('@/views/CommonCom/formDesign'))
const ErrorReportPage = lazy(() => import('@/views/ErrorReport'))

// const Classes = lazy(() => import('@/views/Classes/Classes'))
// const Detection = lazy(() => import('@/views/Detection/Detection/Detection'))
// const Results = lazy(() => import('@/views/Detection/Results/Restults'))

const suspense = (comp: JSX.Element) => <Suspense fallback={<Loading />}>{comp}</Suspense>

// const routes = createBrowserRouter([
//     {
//         path: '/',
//         element: <Navigate to="/login" />,
//         // meta: {
//         //     role: ['admin', 'user'],
//         // },
//     },
//     {
//         path: '/login',
//         element: suspense(<Login />),
//     },
//     {
//         path: '/home',
//         element: suspense(<Home />),
//         children: [
//             {
//                 path: 'user',
//                 element: suspense(<User />),
//             },
//             {
//                 path: 'detection',
//                 element: suspense(<Detection />),
//             },
//             {
//                 path: 'detectionVideo',
//                 element: suspense(<DetectionVideo />),
//             },
//             {
//                 path: 'realTime',
//                 element: suspense(<DetectionStream />),
//             },
//             {
//                 path: 'totalError',
//                 element: suspense(<ErrorReportPage />),
//             },
//             {
//                 path: 'results',
//                 element: (
//                     <AuthRoute>
//                         suspense(
//                         <Results />)
//                     </AuthRoute>
//                 ),
//             },
//             {
//                 path: 'error',
//                 element: suspense(<ErrorPage />),
//             },
//             {
//                 path: 'paper',
//                 element: suspense(<Paper />),
//             },
//             {
//                 path: 'commonComponents',
//                 children: [
//                     {
//                         path: 'button',
//                         element: (
//                             <AuthRoute>
//                                 suspense(
//                                 <CommonButton />)
//                             </AuthRoute>
//                         ),
//                     },
//                     {
//                         path: 'watermark',
//                         element: (
//                             <AuthRoute>
//                                 suspense(
//                                 <CommonWatermark />)
//                             </AuthRoute>
//                         ),
//                     },
//                     {
//                         path: 'formDesign',
//                         element: suspense(<FormDesignPage />),
//                     },
//                 ],
//             },
//         ],
//     },
//     {
//         path: '/*',
//         element: suspense(<ErrorPage />),
//     },
//     {
//         path: '/403',
//         element: suspense(<ForbiddenPage />),
//     },
// ])

const routes = [
    {
        path: '/',
        element: <Navigate to="/login" />,
        // meta: {
        //     role: ['admin', 'user'],
        // },
    },
    {
        path: '/login',
        element: suspense(<Login />),
    },
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
                path: 'detectionVideo',
                element: suspense(<DetectionVideo />),
            },
            {
                path: 'realTime',
                element: suspense(<DetectionStream />),
            },
            {
                path: 'totalError',
                element: suspense(<ErrorReportPage />),
            },
            {
                path: 'results',
                element: (
                    <AuthRoute>
                        suspense(
                        <Results />)
                    </AuthRoute>
                ),
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
                children: [
                    {
                        path: 'button',
                        element: (
                            <AuthRoute>
                                suspense(
                                <CommonButton />)
                            </AuthRoute>
                        ),
                    },
                    {
                        path: 'watermark',
                        element: (
                            <AuthRoute>
                                suspense(
                                <CommonWatermark />)
                            </AuthRoute>
                        ),
                    },
                    {
                        path: 'formDesign',
                        element: suspense(<FormDesignPage />),
                    },
                ],
            },
        ],
    },
    {
        path: '/*',
        element: suspense(<ErrorPage />),
    },
    {
        path: '/403',
        element: suspense(<ForbiddenPage />),
    },
]

export default routes
