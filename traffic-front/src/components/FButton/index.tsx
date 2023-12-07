import React from 'react'
import { QuestionCircleOutlined,SyncOutlined } from '@ant-design/icons'
import { FloatButton } from 'antd'

interface FButton {}
const FButton: React.FC<FButton> = () => (
    <>
        <FloatButton.Group shape="circle" style={{ right: 24 }}>
            {/* <FloatButton type="primary" icon={<SyncOutlined />} /> */}
            <FloatButton.BackTop visibilityHeight={0} type="primary" />
        </FloatButton.Group>
    </>
)

export default React.memo(FButton)
