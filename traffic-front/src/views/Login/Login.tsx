import React, { useEffect, useState, useCallback } from 'react'
import { LockOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { setLocalStorage } from '@/utils/storage'
import initLoginBg from './init'
import './login.css'

import { getCaptcha, login } from '@/utils/user'
import RegisterModal from './components/RegisterModal'
const Login: React.FC = () => {
    // 获取验证码：
    const [captcha, setCaptcha] = useState('')
    const requesetCaptcha = async () => {
        const response = await getCaptcha()
        setCaptcha(response.data.captchaImg)
    }
    useEffect(() => {
        requesetCaptcha()
    }, [])
    const changeCaptchaImg = () => {
        requesetCaptcha()
    }
    const navigate = useNavigate()
    // const [messageApi, contextHolder] = message.useMessage()
    const onFinish = async (values: any) => {
        // if (values.username === 'admin' && values.password == '123456') {
        //     navigate('/home')
        // }

        const { data: res } = await login({
            username: values.username,
            password: values.password,
            vercode: values.vercode,
        })
        console.log(res)
        if (res.error) {
            message.error(res.error)
            requesetCaptcha()
            return
        }
        setLocalStorage('token', res.token)
        navigate('/home')
        message.success('登录成功')
    }
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
    const handleRegister = () => {
        console.log(1)
        setModalIsOpen(true)
    }
    const changeIsOpen = (currentState: boolean) => {
        setModalIsOpen(currentState)
    }
    useEffect(() => {
        initLoginBg()
        window.onresize = function () {
            initLoginBg()
        }
    })

    return (
        <div className="login-main">
            <canvas id="canvas" style={{ display: 'block' }}></canvas>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ username: 'admin', password: '123456' }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <h1 className="title">智慧交通标志检测系统</h1>
                <Form.Item name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="请输入用户名"
                    />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="请输入密码"
                    />
                </Form.Item>
                {/* 验证码 */}
                <Form.Item className="h-8">
                    <Form.Item
                        style={{ width: 'calc(50% - 10px)' }}
                        className="inline-block"
                        name="vercode"
                        rules={[{ required: true, message: '请输入验证码' }]}
                    >
                        <Input
                            prefix={<KeyOutlined className="site-form-item-icon" />}
                            type="text"
                            placeholder="验证码"
                        />
                    </Form.Item>
                    <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 10px)' }}>
                        <img src={captcha} alt="" onClick={changeCaptchaImg} />
                    </Form.Item>
                </Form.Item>
                {/* <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>记住我</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="">
                        忘记密码
                    </a>
                </Form.Item> */}

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                        style={{ backgroundColor: '#1677ff' }}
                    >
                        登录
                    </Button>
                    {/* Or <a href="">现在注册</a> */}
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        className="login-form-button"
                        style={{ backgroundColor: '#1677ff' }}
                        onClick={handleRegister}
                    >
                        注册
                    </Button>
                    {/* Or <a href="">现在注册</a> */}
                </Form.Item>
            </Form>

            <RegisterModal modalIsOpen={modalIsOpen} changeIsOpen={changeIsOpen} />
        </div>
    )
}

export default Login
