import { Form, Tooltip, Modal } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { ReactSortable, SortableEvent } from 'react-sortablejs'
import {
    SaveOutlined,
    DeleteOutlined,
    YoutubeOutlined,
} from '@ant-design/icons'
import { cloneDeep, isEqual } from 'lodash'
import styles from './index.module.scss'
import Preview from './Preview'
import GenerateCode from './GenerateCode'
import FormNode from './FormNode'

interface CenterBoardProps {
    data?: any
    selectItem?: any
    hideKey?: boolean
    currentDragItem?: any
    handleSelectItem: (val: any) => void
    onChange: (value: Array<any>) => void
}

const CenterBoard: React.FC<CenterBoardProps> = ({
    data,
    selectItem,
    currentDragItem,
    handleSelectItem,
    hideKey = false,
    onChange,
}: CenterBoardProps) => {
    const [centerData, setCenterData] = useState<any>(data)
    const [list, setList] = useState<Array<any>>([])
    const [form] = Form.useForm()
    const previewRef = useRef<any>()
    const generateCodeRef = useRef<any>()
    useEffect(() => {
        setCenterData(data)
        setList(data.list)
    }, [data, selectItem])

    const handleCopy = () => {
        const index = list.findIndex((item) => isEqual(item, selectItem))
        if (index !== -1) {
            const newIndex = index + 1
            const arr = cloneDeep(list)
            arr.splice(newIndex, 0, selectItem)
            const key = arr[newIndex].type + '_' + new Date().getTime()
            arr[newIndex] = { ...arr[newIndex], key }
            handleSelectItem(arr[newIndex])
            onChange(arr)
        }
    }
    const handleDelete = () => {
        let currentData: Array<any> = []
        const selectedIndex = list.findIndex(
            (element: any) => element.key === selectItem.key
        )
        if (selectedIndex !== -1) {
            if (list.length === 1) {
                handleSelectItem({ key: '' })
            } else if (list.length - 1 > selectedIndex) {
                handleSelectItem(list[selectedIndex + 1])
            } else {
                handleSelectItem(list[selectedIndex - 1])
            }
            currentData = list.filter(
                (_: any, index: number) => index !== selectedIndex
            )
        }
        onChange(currentData)
    }
    // add drag item to list
    const handleOnAdd = (e: any) => {
        const { newIndex } = e
        const currentList = cloneDeep(list)
        if (newIndex === list.length + 1) {
            currentList.push(currentDragItem)
        } else {
            currentList.splice(newIndex, 0, currentDragItem)
        }
        onChange(currentList)
        handleSelectItem(currentDragItem)
    }

    // clear list
    const handleDeleteAll = () => {
        Modal.confirm({
            title: '提示',
            content: '确认清空吗',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                onChange([])
                handleSelectItem({ key: '' })
            },
            footer: (_, { OkBtn, CancelBtn }) => (
                <>
                    <CancelBtn />
                    <OkBtn />
                </>
            ),
        })
    }
    // monitor data changes through event bubbling , if data changed, update the
    const handleChange = (e: any) => {
        console.log(e)
        if (e.bubbles && ['select', 'checkbox'].includes(selectItem.type)) {
            return
        }
        let value = null
        const { type } = selectItem
        value = [
            'number',
            'select',
            'checkbox',
            'date',
            'time',
            'rate',
            'slider',
            'switch',
        ].includes(type)
            ? e
            : e.target.value
        let [_list, _selectItem] = cloneDeep([list, selectItem])
        const index = _list.findIndex(
            (item: any) => item.key === _selectItem.key
        )
        if (index !== -1) {
            _selectItem = {
                ..._selectItem,
                options: {
                    ..._selectItem.options,
                    value,
                },
            }
            _list[index] = _selectItem
        }
        onChange(_list)
        handleSelectItem(_selectItem)
    }
    const handleEnd = ({ oldIndex, newIndex }: SortableEvent) => {
        if (oldIndex !== newIndex) {
            let arr = cloneDeep(list)
            ;[arr[oldIndex], arr[newIndex]] = [arr[newIndex], arr[oldIndex]]
            onChange(arr)
        }
    }
    return (
        <div className="w-[60%] border-gray-300 border-y-2 border-solid overflow-auto border-b-[2px]">
            <div className="flex justify-end h-[40px] gap-3 pl-[10px] border-solid border-b-[1px] border-[#f0f0f0]">
                <Tooltip
                    title="预览"
                    className=" cursor-pointer text-[#5ec829] hover:text-blue-500 text-xl"
                >
                    <YoutubeOutlined
                        onClick={() => previewRef.current.changeModalState()}
                    />
                </Tooltip>
                <Tooltip
                    title="生成代码"
                    className=" cursor-pointer text-[#5ec829] hover:text-blue-500 text-xl"
                >
                    <SaveOutlined
                        onClick={() =>
                            generateCodeRef.current.changeModalState()
                        }
                    />
                </Tooltip>
                <Tooltip
                    title="清空"
                    className=" cursor-pointer text-red-300 hover:text-red-500 text-xl"
                >
                    <DeleteOutlined onClick={handleDeleteAll} />
                </Tooltip>
            </div>
            <div style={{ height: 'calc(100% - 40px)' }} className="relative">
                {list.length === 0 && (
                    <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl text-blue-300">
                        从左侧选择控件添加
                    </p>
                )}
                <Form
                    form={form}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    className="w-full h-full"
                    // requiredMark={true}
                    // requiredMark
                    style={centerData.config.customStyle}
                    layout={centerData.config.layout}
                    labelCol={centerData.config.labelCol}
                    wrapperCol={centerData.config.wrapperCol}
                    onChange={handleChange}
                    size={centerData.config.size}
                    disabled={centerData.config.disabled}
                >
                    <ReactSortable
                        group="form-draggable"
                        animation={150}
                        tag="div"
                        className="w-full h-full"
                        ghostClass={styles['sortable-ghost']}
                        list={list}
                        setList={setList}
                        onStart={(e) => handleSelectItem(list[e.oldIndex])}
                        onAdd={handleOnAdd}
                        onEnd={handleEnd}
                    >
                        {list.map((record: any) => {
                            return (
                                <FormNode
                                    record={record}
                                    selectItem={selectItem}
                                    hideKey={hideKey}
                                    config={centerData.config}
                                    handleCopy={handleCopy}
                                    handleDelete={handleDelete}
                                    handleSelectItem={handleSelectItem}
                                    handleClick={() => handleSelectItem(record)}
                                    onChange={handleChange}
                                    key={record.key}
                                    className={`w-full pt-2 pl-2 mb-[2px] rounded relative
                                      border-solid border-blue-400 hover:bg-[#deebf8]
                                     ${
                                         record.key === selectItem.key
                                             ? 'bg-blue-50 border-b-[3px] shadow-md shadow-blue-200'
                                             : ''
                                     }
                                     `}
                                />
                            )
                        })}
                    </ReactSortable>
                </Form>
            </div>

            <Preview ref={previewRef} data={centerData} />
            <GenerateCode ref={generateCodeRef} data={centerData} />
        </div>
    )
}
export default React.memo(CenterBoard)
