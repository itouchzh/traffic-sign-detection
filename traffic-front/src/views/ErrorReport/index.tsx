import { getError } from '@/utils/reportError'
import { formatTime } from '@/utils/time'
import { Button, Card, Form, Input, Space, Table, TableProps, Tag } from 'antd'
import React, { useEffect } from 'react'
interface DataType {
    id: string
    page_url: string
    reason: string
    start_time: string
    sub_type: string
    occurrence_time: string
}
const columns: TableProps<DataType>['columns'] = [
    {
        title: '错误id',
        dataIndex: 'id',
        key: 'id',
        width: 100,
    },
    {
        title: '错误url',
        dataIndex: 'page_url',
        key: 'page_url',
    },
    {
        title: '错误原因',
        dataIndex: 'reason',
        key: 'reason',
    },
    {
        title: '开始时间',
        key: 'start_time',
        dataIndex: 'start_time',
    },
    {
        title: '错误类型',
        key: 'sub_type',
        dataIndex: 'sub_type',
        render: (_, record) => <Tag color="error">{record.sub_type}</Tag>,
    },
    {
        title: '发生时间',
        key: 'occurrence_time',
        dataIndex: 'occurrence_time',
        width: 350,
    },
    {
        title: 'Action',
        key: 'action',
        fixed: 'right',
        render: (_, record) => (
            <Space size="middle">
                <a>Delete</a>
            </Space>
        ),
    },
]

const ErrorReportPage = () => {
    const [promiseErrorData, setPromiseErrorData] = React.useState<DataType[]>([])
    const getPromiseErrorData = async () => {
        const { data: res } = await getError()
        console.log(res)
        const needRed = res.map((item: any) => ({
            ...item,
            key: item.id,
        }))
        setPromiseErrorData(needRed)
    }
    useEffect(() => {
        getPromiseErrorData()
    }, [])
    return (
        <div>
            <Card className="w-full">
                <Form
                    name="findUserForm"
                    labelCol={{ span: 5 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    className="min-w-xs flex justify-start gap-10"
                >
                    {/* <Form.Item label="用户Id" name="id">
                        <Input />
                    </Form.Item>
                    <Form.Item label="用户名" name="username">
                        <Input />
                    </Form.Item> */}
                    {/* <Form.Item>
                        <Button type="primary" onClick={handleFindUser}>
                            搜索
                        </Button>
                    </Form.Item> */}
                </Form>
            </Card>
            <Table columns={columns} dataSource={promiseErrorData} />
        </div>
    )
}

export default ErrorReportPage
