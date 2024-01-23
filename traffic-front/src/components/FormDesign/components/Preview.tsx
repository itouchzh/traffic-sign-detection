import { Modal } from 'antd'
import React, { useEffect, useImperativeHandle, useState } from 'react'
import FormBuild from './FormBuild'
import { IData, IRecord } from './interface'

export interface PreviewProps {
    className?: string
    data?: IData
    onChange?: (value: IRecord[], key?: string) => void
}

const Preview = ({ className, data, onChange }: PreviewProps, ref: any) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
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
                <FormBuild data={data} className="p-5" onChange={onChange} />
            </Modal>
        </div>
    )
}

export default React.forwardRef(Preview)
