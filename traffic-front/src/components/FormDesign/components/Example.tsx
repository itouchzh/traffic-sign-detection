export {}

import React, { useState, useEffect } from 'react'
import { Form, Space, Button, Input } from 'antd'
interface IProps {}
const App: React.FC<IProps> = ({}: IProps) => {
    const [form] = Form.useForm()
    return (
        <>
            <Form form={form} layout="horizontal" size="middle" requiredMark={undefined}>
                <Form.Item label="输入框" name="input_1702633464939" initialValue="">
                    <Input
                        placeholder="请输入"
                        maxLength={10}
                        allowClear={true}
                        bordered={true}
                        disabled={false}
                        type="text"
                        size="middle"
                    />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                        <Button htmlType="reset">重置</Button>
                    </Space>
                </Form.Item>
            </Form>
        </>
    )
}
export default App

