import React, { useState, useCallback, useEffect } from 'react'
import { Form, Input, Modal, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { registerUser } from '@/utils/user'
import { Rule } from 'antd/es/form'

interface RefisterModalProps {
    modalIsOpen?: boolean
    changeIsOpen?: (value: boolean) => void
}

type FieldType = {
    username?: string
    password?: string
    confirmPassword?: string
}
const RegisterModal: React.FC<RefisterModalProps> = ({
    modalIsOpen = false,
    changeIsOpen = (value: boolean) => {},
}: RefisterModalProps) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [messageApi, contextHolder] = message.useMessage()
    const [form] = useForm()
    const handleSend = () => {
        console.log(form.getFieldsValue())
        form.validateFields()
        const { username, password } = form.getFieldsValue()
        registerUser({ username, password }).then((res: any) => {
            console.log(res)
            if (res.status && res.error) {
                messageApi.open({
                    type: 'error',
                    content: res.error,
                })
                return
            }
            messageApi.open({
                type: 'success',
                content: '注册成功，请登录',
            })
        })

        setModalOpen(false)
        changeIsOpen(false)
    }
    const handleCancel = useCallback(() => {
        setModalOpen(false)
        changeIsOpen(false)
    }, [])
    useEffect(() => {
        setModalOpen(modalIsOpen)
        form.resetFields()
    }, [modalIsOpen])

    const handleUserNameChange = (e: any) => {
        // let value = e.target.value
    }

    return (
        <div>
            {contextHolder}
            <Modal
                title="欢迎注册"
                centered
                open={modalOpen}
                onOk={() => handleSend()}
                onCancel={() => handleCancel()}
                okText="确定"
                cancelText="取消"
            >
                <div>
                    已有账号，去<a onClick={handleCancel}>登录</a>
                </div>
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    form={form}
                >
                    <Form.Item<FieldType>
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                        <Input onChange={handleUserNameChange} />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="密码"
                        name="password"
                        rules={[
                            { required: true },
                            () => ({
                                validator(_, value) {
                                    // const reg =
                                    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/
                                    // if (value.match(reg) === null) {
                                    //     return Promise.reject(
                                    //         new Error(
                                    //             '密码需要大于6位，且包含大小写字母,数字和特殊字符'
                                    //         )
                                    //     )
                                    // } else {
                                    //     return Promise.resolve()
                                    // }
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="确认密码"
                        name="confirmPassword"
                        dependencies={['password']}
                        // help="请确认密码"
                        rules={[
                            {
                                required: true,
                                message: '请再次输入密码',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(new Error('密码与第一次输入不匹配!'))
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default React.memo(RegisterModal)
