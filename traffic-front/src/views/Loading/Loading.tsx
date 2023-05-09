import React from 'react'
import { Space, Spin } from 'antd'

const Loading: React.FC = () => (
    <Space size="middle">
        <Spin size="large" />
    </Space>
)

export default Loading
