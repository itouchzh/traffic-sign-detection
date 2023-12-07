import React, { useEffect } from 'react'
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import useStopPropagation from '@/hooks/useStopPropagation'
import AFormItem from './AFormItem'

interface IFormNodeProps {
    className?: string
    record?: any
    selectItem?: any
    config?: any
    startType?: String
    hideKey?: boolean
    handleCopy: () => void
    handleDelete: () => void
    handleSelectItem?: (record: any) => void
    handleClick: () => void
    onChange: (value: any) => void
}
const FormNode: React.FC<IFormNodeProps> = ({
    className,
    record,
    selectItem,
    hideKey = true,
    handleCopy,
    handleDelete,
    handleClick,
    config,
    onChange,
}: IFormNodeProps) => {
    const handleCopyItem = useStopPropagation(handleCopy)
    const handleDeleteItem = useStopPropagation(handleDelete)
    // useEffect(() => {
    //     console.log(record)
    // }, [selectItem, record])
    return (
        <div onClick={handleClick} className={className}>
            <AFormItem record={record} config={config} onChange={onChange} />
            {hideKey ? (
                ''
            ) : (
                <div className=" text-blue-500 absolute bottom-0">
                    {record.key}
                </div>
            )}

            <div className="flex w-full justify-end gap-4 h-8">
                <div
                    className={`w-15  rounded-tl-[16px] ${
                        record.key === selectItem.key ? '' : 'hidden'
                    }`}
                >
                    <Tooltip title="复制">
                        <Button
                            // type="primary"
                            shape="circle"
                            className=" text-blue-400 cursor-pointer  "
                            icon={<CopyOutlined />}
                            onClick={handleCopyItem}
                        />
                    </Tooltip>
                    <Tooltip title="删除">
                        <Button
                            // type="primary"
                            shape="circle"
                            className=" text-blue-400 cursor-pointer  ml-2"
                            icon={<DeleteOutlined />}
                            onClick={handleDeleteItem}
                        />
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}

export default React.memo(FormNode)
