import React, { useEffect, useState } from 'react'
import {
    Button,
    Space,
    Table,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    Switch,
    Card,
    message,
    Pagination,
} from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { addOneUser, getAllUsers, editUserById, deleteUserById, findUserById } from '@/utils/user'
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
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={(e) => openEditUserModal(record)}>
                        编辑
                    </Button>
                    <Button danger onClick={() => deleteUser(record.id)}>
                        删除
                    </Button>
                </Space>
            ),
        },
    ]

    const [users, setUsers] = useState<DataType[]>([])
    const getUsers = async () => {
        const { data: res } = await getAllUsers()
        setUsers(res)
    }
    useEffect(() => {
        getUsers()
    }, [])

    // add user
    const [modalOpen, setModalOpen] = useState(false)
    const [addUserForm] = Form.useForm()

    const onEditFinish = (values: any) => {
        console.log(values)
    }
    // 点击确定处理函数
    const handleSubmit = async () => {
        const values = addUserForm.getFieldsValue()
        // 添加用户信息
        const { data: res } = await addOneUser({
            username: values.username,
            phone: values.phone,
            email: values.prefixEmail + values.suffixEmail,
            address: values.address,
            carNumber: values.carNumber,
        })
        if (res.error) {
            message.error(res.error)
            return
        }
        message.success(res.message)
        setModalOpen(false)
        addUserForm.resetFields()
        getUsers()
    }

    // edit user
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [editUserForm] = Form.useForm()
    const openEditUserModal = (record: DataType) => {
        setEditModalOpen(true)
        editUserForm.setFieldsValue(record)
    }
    const handleEditSubmit = async () => {
        const values = editUserForm.getFieldsValue()
        const { data: res } = await editUserById({
            id: values.id,
            username: values.username,
            phone: values.phone,
            email: values.prefixEmail + values.suffixEmail,
            address: values.address,
            carNumber: values.carNumber,
        })
        console.log(res)

        if (res.error) {
            message.error(res.error)
            return
        }
        message.success(res.message)
        setEditModalOpen(false)
        editUserForm.resetFields()
        getUsers()
    }

    const { confirm } = Modal
    //  删除用户
    const deleteUser = (id: string) => {
        confirm({
            title: '确认要删除吗?',
            icon: <ExclamationCircleFilled />,
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            // content: 'Some descriptions',
            async onOk() {
                const { data: res } = await deleteUserById(id)
                if (res.message) {
                    message.success(res.message)
                    getUsers()
                }
            },
            onCancel() {
                message.success('取消删除')
            },
        })
    }

    //  查找用户
    const [findUserForm] = Form.useForm()
    const handleFindUser = async () => {
        const values = findUserForm.getFieldValue('id')
        console.log(values)
        if (!values) {
            getUsers()
            return
        }
        const { data: res } = await findUserById(values)
        if (res.message) {
            message.success(res.message)
        }
        setUsers([res.userInfo])
    }
    // 点击表格中行
    // const handleClickRow = (record: DataType) => {
    //     console.log(record)
    // }
    return (
        <div>
            <Card className="w-full">
                <Form
                    name="findUserForm"
                    labelCol={{ span: 5 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    className="min-w-xs flex justify-start gap-10"
                    form={findUserForm}
                >
                    <Form.Item label="用户Id" name="id">
                        <Input />
                    </Form.Item>
                    <Form.Item label="用户名" name="username">
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={handleFindUser}>
                            {' '}
                            搜索
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={() => setModalOpen(true)}>
                            添加用户
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Table
                columns={columns}
                pagination={{
                    position: ['bottomRight'],
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }}
                dataSource={users}
                rowKey={(record) => record.id}

                // onRow={(record) => {
                //     return {
                //         onClick: () => handleClickRow(record),
                //     }
                // }}
            />
            <Modal
                title="添加用户"
                centered
                open={modalOpen}
                onOk={handleSubmit}
                onCancel={() => setModalOpen(false)}
            >
                <Form
                    name="addUserForm"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onEditFinish}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    form={addUserForm}
                >
                    <Form.Item label="用户名" name="username">
                        <Input />
                    </Form.Item>
                    <Form.Item label="电话" name="phone">
                        <Input />
                    </Form.Item>
                    <Form.Item label="地址" name="address">
                        <Input />
                    </Form.Item>
                    <Form.Item label="邮箱">
                        <Space.Compact>
                            <Form.Item name="prefixEmail" noStyle>
                                <Input className="w-full" placeholder="输入邮箱" />
                            </Form.Item>
                            <Form.Item name="suffixEmail" noStyle>
                                <Select placeholder="选择邮箱">
                                    <Select.Option value="@qq.com">@qq.com</Select.Option>
                                    <Select.Option value="@gmail.com">@gmail.com</Select.Option>
                                    <Select.Option value="@163.com">@163.com</Select.Option>
                                    <Select.Option value="@126.com">@126.com</Select.Option>
                                    <Select.Option value="@outlook.com">@outlook.com</Select.Option>
                                </Select>
                            </Form.Item>
                        </Space.Compact>
                    </Form.Item>
                    <Form.Item label="车牌号" name="carNumber">
                        <Input />
                    </Form.Item>
                    <Form.Item label="创建时间" name="createDate">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item label="状态" valuePropName="checked" name="status">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="身份" name="identity">
                        <Select>
                            <Select.Option value="admin">管理员</Select.Option>
                            <Select.Option value="commonUser">用户</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="修改用户"
                centered
                open={editModalOpen}
                onOk={handleEditSubmit}
                onCancel={() => setEditModalOpen(false)}
            >
                <Form
                    name="editUserForm"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 800 }}
                    initialValues={{ remember: true }}
                    form={editUserForm}
                >
                    <Form.Item label="用户Id" name="id">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="用户名" name="username">
                        <Input />
                    </Form.Item>
                    <Form.Item label="电话" name="phone">
                        <Input />
                    </Form.Item>
                    <Form.Item label="地址" name="address">
                        <Input />
                    </Form.Item>
                    <Form.Item label="邮箱">
                        <Space.Compact>
                            <Form.Item name="prefixEmail" noStyle>
                                <Input className="w-full" placeholder="输入邮箱" />
                            </Form.Item>
                            <Form.Item name="suffixEmail" noStyle>
                                <Select placeholder="选择邮箱">
                                    <Select.Option value="@qq.com">@qq.com</Select.Option>
                                    <Select.Option value="@gmail.com">@gmail.com</Select.Option>
                                    <Select.Option value="@163.com">@163.com</Select.Option>
                                    <Select.Option value="@126.com">@126.com</Select.Option>
                                    <Select.Option value="@outlook.com">@outlook.com</Select.Option>
                                </Select>
                            </Form.Item>
                        </Space.Compact>
                    </Form.Item>
                    <Form.Item label="车牌号" name="carNumber">
                        <Input />
                    </Form.Item>
                    <Form.Item label="修改时间" name="createDate">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item label="状态" valuePropName="checked" name="status">
                        <Switch />
                    </Form.Item>
                    {/* <Form.Item label="身份" name="identity">
                        <Select>
                            <Select.Option value="admin">管理员</Select.Option>
                            <Select.Option value="commonUser">用户</Select.Option>
                        </Select>
                    </Form.Item> */}
                </Form>
            </Modal>
        </div>
    )
}

export default App
