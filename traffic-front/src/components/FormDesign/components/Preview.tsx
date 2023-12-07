import { Modal } from 'antd'
import React, { useEffect, useImperativeHandle, useState } from 'react'
import FormBuild from './FormBuild'

interface PreviewProps {
    className?: string
    data?: any
}
const Preview = ({ className, data }: PreviewProps, ref: any) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [jsonData, setJsonData] = useState<any>(null)
    useEffect(() => {
        setJsonData(data)
    }, [data])
    const changeModalState = () => {
        setIsModalOpen(!isModalOpen)
    }

    const handleOk = () => {
        setIsModalOpen(false)
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }
    useImperativeHandle(ref, () => {
        return {
            changeModalState,
        }
    })

    return (
        <div className={className}>
            <Modal
                title="表单预览"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="关闭"
                okText="确定"
                width={850}
                className=" m-auto"
            >
                <FormBuild value={jsonData} className="p-5" />
            </Modal>
        </div>
    )
}

export default React.forwardRef(Preview)
