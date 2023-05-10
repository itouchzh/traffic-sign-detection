import React, { useEffect, useState } from 'react'
import {
    Button,
    Radio,
    Space,
    Table,
    Tag,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    Switch,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { getAllUsers } from '@/services/user'
interface DataType {
    id: string
    username: string
    phone: string
    address: string
    carNumber: string
    carId: string
    email: string
    createAt: string
}

const App: React.FC = () => {
    const [modal2Open, setModal2Open] = useState(false)
    const columns: ColumnsType<DataType> = [
        {
            title: '用户Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '电话号码',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <Space size="middle">
                    <Button
                        type="link"
                        onClick={() => {
                            setModal2Open(true)
                        }}
                    >
                        编辑
                    </Button>
                    <Button danger>删除</Button>
                </Space>
            ),
        },
    ]

    const [users, setUsers] = useState<DataType[]>([])
    useEffect(() => {
        const getUsers = async () => {
            const { data: res } = await getAllUsers()
            setUsers(res)
        }
        getUsers()
    }, [])

    return (
        <div>
            <Table
                columns={columns}
                pagination={{ position: ['bottomRight'] }}
                dataSource={users}
                rowKey={(record) => record.id}
            />
            <Modal
                title="修改用户信息"
                centered
                open={modal2Open}
                onOk={() => setModal2Open(false)}
                onCancel={() => setModal2Open(false)}
            >
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    // onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item label="Username" name="username">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Phone" name="phone">
                        <Input />
                    </Form.Item>
                    <Form.Item label="地址" name="address">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Space.Compact>
                            <Form.Item name={['email']} noStyle>
                                <Input style={{ width: '100%' }} placeholder="输入邮箱" />
                            </Form.Item>
                            <Form.Item
                                // name={['email']}
                                noStyle
                            >
                                <Select placeholder="选择邮箱">
                                    <Select.Option value="qq">@qq.com</Select.Option>
                                    <Select.Option value="gamil">@gmail.com</Select.Option>
                                    <Select.Option value="163">@163.com</Select.Option>
                                    <Select.Option value="126">@126.com</Select.Option>
                                    <Select.Option value="outlook">@outlook.com</Select.Option>
                                </Select>
                            </Form.Item>
                        </Space.Compact>
                    </Form.Item>
                    <Form.Item label="车牌号" name="carNumber">
                        <Input />
                    </Form.Item>
                    <Form.Item label="DatePicker">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item label="状态" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="身份">
                        <Select>
                            <Select.Option value="admin">管理员</Select.Option>
                            <Select.Option value="commonUser">用户</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default App
