import React, { MouseEventHandler, useEffect } from 'react'
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import AFormItem from './AFormItem'
import useClickAction from '@/hooks/useClickAction'
import { useSelectItemContext } from '@/context/useSelectItem'

interface IFormNodeProps {
    record?: any
    config?: any
    startType?: String
    hideKey?: boolean
    handleCopy: () => void
    handleDelete: () => void
    onChange: (value: any) => void
}
const FormNode: React.FC<IFormNodeProps> = ({
    record,
    hideKey = true,
    handleCopy,
    handleDelete,
    config,
    onChange,
}: IFormNodeProps) => {

    const {selectItem, setSelectItem} = useSelectItemContext()
    const handleCopyItem = useClickAction(handleCopy)
    const handleDeleteItem = useClickAction(handleDelete)
    const onClick = useClickAction(() => setSelectItem(record))

    return (
        <div
            onClick={onClick}
            className={`w-full pt-2 mb-[2px] rounded relative
        border-dashed border-blue-200 hover:bg-[#deebf8] border 
       ${record.key === selectItem.key ? 'bg-blue-50' : ''}
       `}
        >
            <AFormItem record={record} config={config} onChange={onChange} />

            <div className="flex justify-end gap-4 h-8 items-center absolute top-0 right-0">
                {/* {!hideKey && <div className=" text-blue-500">{record.key}</div>} */}
                <div className={`w-15  rounded-tl-[16px] ${record.key === selectItem.key ? '' : 'hidden'}`}>
                    <Tooltip title="复制">
                        <Button
                            // type="primary"
                            shape="circle"
                            className=" text-blue-400 cursor-pointer"
                            icon={<CopyOutlined />}
                            onClick={handleCopyItem}
                        />
                    </Tooltip>
                    <Tooltip title="删除">
                        <Button
                            // type="primary"
                            shape="circle"
                            className=" text-blue-400 cursor-pointer ml-2"
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
