import { Suspense, lazy } from 'react'
import { Navigate } from 'react-router-dom'
// import About from '@/views/About'
// import Home from '@/views/Home'
// 懒加载
// const About = lazy(() => import('@/views/About'))
const Home = lazy(() => import('@/views/Home/Home'))
const Login = lazy(() => import('@/views/Login/Login'))
// const User = lazy(() => import('@/views/User/User'))
// const Classes = lazy(() => import('@/views/Classes/Classes'))
// const Detection = lazy(() => import('@/views/Detection/Detection/Detection'))
// const Results = lazy(() => import('@/views/Detection/Results/Restults'))

const suspense = (comp: JSX.Element) => <Suspense fallback={<div>Loading...</div>}>{comp}</Suspense>

const routes = [
    {
        path: '/',
        element: <Navigate to="/login" />,
    },
    {
        path: '/login',
        element: suspense(<Login />),
    },
    {
        path: '/home',
        element: suspense(<Home />),
    },
]
export default routes
