import React from 'react'
import ReactDOM from 'react-dom/client'
import 'reset-css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import zhCN from 'antd/locale/zh_CN'

import '@/assets/styles/init.css'
import { Provider } from 'react-redux'
import { store, persisstore } from './state/store'
// store持久化
import { PersistGate } from 'redux-persist/integration/react'
import ContextProvider from './context'
import { ConfigProvider } from 'antd'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ContextProvider>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persisstore}>
                        <ConfigProvider locale={zhCN}>
                            <App />
                        </ConfigProvider>
                    </PersistGate>
                </Provider>
            </ContextProvider>
        </BrowserRouter>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
