import React, { useState } from 'react'
import { Button, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
interface DataType {
    key: string
    name: string
    age: number
    address: string
    tags: string[]
}

const data: DataType[] = [
    {
        key: '111',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
]
interface ComTableProps {
    onClickCheckBox: (val: React.Key[]) => void
    data?: Array<any>
}
const ComTable: React.FC<ComTableProps> = ({ onClickCheckBox, data = [] }) => {
    const [columnsData, setColumnsData] = useState<Array<any>>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const [loading, setLoading] = useState(false)
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys)
        onClickCheckBox(newSelectedRowKeys)
        setSelectedRowKeys(newSelectedRowKeys)
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }
    const columns: ColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '图像名',
            dataIndex: 'image_name',
            key: 'image_name',
        },

        {
            title: '检测时间',
            dataIndex: 'detection_time',
            key: 'detection_time',
        },
        {
            title: '置信度',
            dataIndex: 'confidence',
            key: 'confidence',
        },
        {
            title: 'IoU',
            dataIndex: 'iou',
            key: 'iou',
        },
        // {
        //     title: 'Tags',
        //     key: 'tags',
        //     dataIndex: 'tags',
        //     render: (_, { tags }) => (
        //         <>
        //             {tags.map((tag) => {
        //                 let color = tag.length > 5 ? 'geekblue' : 'green'
        //                 if (tag === 'loser') {
        //                     color = 'volcano'
        //                 }
        //                 return (
        //                     <Tag color={color} key={tag}>
        //                         {tag.toUpperCase()}
        //                     </Tag>
        //                 )
        //             })}
        //         </>
        //     ),
        // },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button danger onClick={() => handleDeleteItem(record)}>
                        删除
                    </Button>
                    <Button onClick={() => handleDetail(record)}>详细信息</Button>
                </Space>
            ),
        },
    ]
    const handleDeleteItem = (record: any) => {
        console.log(record)
    }
    const handleDetail = (record: any) => {}

    return (
        <div>
            <Table
                columns={columns}
                dataSource={data}
                rowSelection={rowSelection}
                rowKey={(record) => record.id}
            />
        </div>
    )
}

export default React.memo(ComTable)
