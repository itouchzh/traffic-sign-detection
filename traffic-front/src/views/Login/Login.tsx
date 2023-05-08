import React, { useEffect, useState } from 'react'
import { LockOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import initLoginBg from './init'
import './login.scss'

import { getCaptcha, login } from '@/services/user'
const Login: React.FC = () => {
    const navigate = useNavigate()

    const onFinish = (values: any) => {
        // if (values.username === 'admin' && values.password == '123456') {
        //     navigate('/home')
        // }
        // const userLogin = async () => {
        //     const res = await login({
        //         username: 'admin',
        //         password: '123456',
        //         captcha: '1234',
        //     })
        //     console.log(res)
        // }
        // userLogin()
        console.log(values)
    }
    useEffect(() => {
        initLoginBg()
        window.onresize = function () {
            initLoginBg()
        }
    })
    // 获取验证码：
    const [captcha, setCaptcha] = useState('')
    const requesetCaptcha = async () => {
        const response = await getCaptcha()
        console.log(response)
        setCaptcha(response.data.captchaImg)
    }
    useEffect(() => {
        requesetCaptcha()
    }, [])
    const changeCaptchaImg = () => {
        requesetCaptcha()
    }

    return (
        <div className="login-main">
            <canvas id="canvas" style={{ display: 'block' }}></canvas>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true, username: 'admin', password: '123456' }}
                onFinish={onFinish}
            >
                <h1 className="title">知行交通标志检测系统</h1>
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Username"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item
                    // name="verificationCode"
                    // rules={[{ required: true, message: 'Please input your Password!' }]}

                    className="h-8"
                >
                    <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 10px)' }}>
                        <Input
                            prefix={<KeyOutlined className="site-form-item-icon" />}
                            type="text"
                            placeholder="Verificate Code"
                        />
                    </Form.Item>
                    <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 10px)' }}>
                        <img src={captcha} alt="" onClick={changeCaptchaImg} />
                    </Form.Item>
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>记住我</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="">
                        忘记密码
                    </a>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                        style={{ backgroundColor: '#1677ff' }}
                    >
                        登录
                    </Button>
                    Or <a href="">现在注册</a>
                </Form.Item>
            </Form>
            {/* <h1 className='bg-slate-300 w-6 h-4 '>Hello World</h1> */}
        </div>
    )
}

export default Login
