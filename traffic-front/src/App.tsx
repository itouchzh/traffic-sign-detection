import React, { useEffect } from 'react'
import routes from './router'
import { useRoutes } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import './App.css'
import AuthRoute from './components/AuthRoute'
import minitor from './utils/report'
function App() {
    const outlet = useRoutes(routes)
    useEffect(() => {
        minitor.init({ url: 'http://localhost:5001/addReport' })
    }, [])
    return (
        <div className="App">
            <AuthRoute>{outlet}</AuthRoute>
        </div>
    )

    // return <RouterProvider router={routes} />
}

export default App
