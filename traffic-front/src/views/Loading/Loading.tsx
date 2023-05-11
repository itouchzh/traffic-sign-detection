import React from 'react'
import { Space, Spin } from 'antd'

const Loading: React.FC = () => (
    <Space size="large" className="w-full h-full flex justify-center items-center">
        <Spin size="large" />
    </Space>
)

export default Loading
