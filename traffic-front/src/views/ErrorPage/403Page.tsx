import React from 'react'
import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

const ForbiddenPage: React.FC = () => {
    const navigate = useNavigate()
    return (
        <Result
            status="403"
            title="403"
            subTitle="不好意思，您无权访问此页面，请联系管理员，谢谢！"
            extra={
                <Button type="primary" onClick={() => navigate('/home')}>
                    Back Home
                </Button>
            }
        />
    )
}

export default ForbiddenPage
