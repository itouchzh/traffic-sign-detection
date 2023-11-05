import React from 'react'
import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

export interface ErrorPageProps {}
const ErrorPage: React.FC<ErrorPageProps> = () => {
    const navigate = useNavigate()
    const handleToHome = () => {
        navigate('/home')
    }
    return (
        <>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Button type="primary" onClick={handleToHome}>
                        Back Home
                    </Button>
                }
            />
        </>
    )
}

export default React.memo(ErrorPage)
