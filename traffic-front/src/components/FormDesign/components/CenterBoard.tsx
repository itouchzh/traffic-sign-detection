import { Form, Tooltip, Modal, Row, Col, Button } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { ReactSortable, SortableEvent } from 'react-sortablejs'
import { SaveOutlined, DeleteOutlined, YoutubeOutlined, CopyOutlined } from '@ant-design/icons'
import { cloneDeep, isEqual } from 'lodash'
import styles from './index.module.scss'
import Preview from './Preview'
import GenerateCode from './GenerateCode'
import { IRecord } from './interface'
import LayoutItem from './LayoutItem'
import { useSelectItemContext } from '@/context/useSelectItem'

interface CenterBoardProps {
    data?: any
    hideKey?: boolean
    currentDragItem?: any
    onChange: (value: Array<any>) => void
}

const CenterBoard: React.FC<CenterBoardProps> = ({
    data,
    currentDragItem,
    hideKey = false,
    onChange,
}: CenterBoardProps) => {
    const [centerData, setCenterData] = useState<any>(data)
    const [list, setList] = useState<Array<any>>([])
    const [form] = Form.useForm()
    const previewRef = useRef<any>()
    const generateCodeRef = useRef<any>()
    const { selectItem, setSelectItem } = useSelectItemContext()
    useEffect(() => {
        setCenterData(data)
        setList(data.list)
        console.log(selectItem)
    }, [data, selectItem])

    const handleCopy = () => {
        const traverse = (array: IRecord[]) => {
            for (let i = 0; i < array.length; i++) {
                const element = array[i]
                if (element.key === selectItem.key) {
                    // 复制添加到选择节点后面
                    array.splice(i + 1, 0, { ...element }) // 使用 { ...element } 复制对象
                    console.log(array)
                    handleColAddCopy(i + 1, array)
                    break // 中断整个循环
                }
                if (element.type === 'grid') {
                    // 栅格布局
                    element.columns!.forEach((item: any) => {
                        traverse(item.list)
                    })
                } else if (element.type === 'card') {
                    // 卡片
                    traverse(element.list)
                }
            }
        }

        traverse(cloneDeep(list))
    }
    const handleDelete = () => {
        // 递归遍历查找需要删除的项
        const traverse = (array: IRecord[]) => {
            const newArray: IRecord[] = []
            array.forEach((element, index) => {
                if (element.type === 'grid') {
                    // 栅格布局
                    element.columns!.forEach((item: any) => {
                        item.list = traverse(item.list)
                    })
                }
                if (element.type === 'card') {
                    element.list = traverse(element.list)
                }
                if (element.key !== selectItem.key) {
                    newArray.push(element)
                } else {
                    if (array.length === 1) {
                        setSelectItem({ key: '', options: {} })
                    } else if (array.length - 1 > index) {
                        setSelectItem(array[index + 1])
                    } else {
                        setSelectItem(array[index - 1])
                    }
                }
            })
            return newArray
        }
        onChange(traverse(list))
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
        setSelectItem(currentDragItem)
    }
    const handleColDragAdd = (_evt: any, record: IRecord, index: number, type: string = 'grid') => {
        const currentList = cloneDeep(list)
        const recursiveSearch = (arr: IRecord[]) => {
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i]
                if (item.key === record.key) {
                    if (type === 'grid') {
                        item.columns![index].list.push(currentDragItem)
                    } else if (type === 'card') {
                        item.list.push(currentDragItem)
                    }
                    return arr // 找到匹配项后中断整个递归
                }
                if (item.type === 'grid') {
                    item?.columns?.forEach((col: any) => {
                        recursiveSearch(col.list)
                    })
                }
                if (item.type === 'card') {
                    recursiveSearch(item.list)
                }
            }
            return arr
        }
        onChange(recursiveSearch(currentList))
        setSelectItem(currentDragItem)
    }
    const handleColAddCopy = (newIndex: number, columns: IRecord[]) => {
        // 处理普通的添加
        const index = list.findIndex((item) => isEqual(item, selectItem))
        const key = columns[newIndex].type + '_' + new Date().getTime()
        columns[newIndex] = { ...columns[newIndex], key }
        if (index !== -1) {
            setSelectItem(columns[newIndex])
            onChange(columns)
            return
        }
        // 容器添加
        const cloneList = cloneDeep(list)
        let findIndex = { firstIndex: -1, secondIndex: -1 }
        outerLoop: for (let firstIndex = 0; firstIndex < cloneList.length; firstIndex++) {
            const item = cloneList[firstIndex]
            if (item.type === 'grid') {
                gridLoop: for (let secondIndex = 0; secondIndex < item.columns.length; secondIndex++) {
                    const colItem = item.columns[secondIndex]
                    for (let thirdIndex = 0; thirdIndex < colItem.list.length; thirdIndex++) {
                        const listItem = colItem.list[thirdIndex]
                        if (listItem.key === selectItem.key) {
                            findIndex = { firstIndex, secondIndex }
                            break gridLoop
                        }
                    }
                }
                cloneList[findIndex.firstIndex].columns[findIndex.secondIndex].list = columns
                break outerLoop
            } else if (item.type === 'card') {
                cardLoop: for (let i = 0; i < item.list.length; i++) {
                    if (item.list[i].key === selectItem.key) {
                        findIndex = { firstIndex, secondIndex: 0 }
                        break cardLoop
                    }
                }
                cloneList[findIndex.firstIndex].list = columns
                break outerLoop
            }
        }
        onChange(cloneList)
        setSelectItem(columns[newIndex])
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
                setSelectItem({ key: '', options: {} })
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
        if (e.bubbles && ['select', 'checkbox'].includes(selectItem.type || '')) {
            return
        }
        let value = ['number', 'select', 'checkbox', 'date', 'time', 'rate', 'slider', 'switch'].includes(
            selectItem.type || ''
        )
            ? e
            : e.target.value
        let curSelectItem = cloneDeep(selectItem)
        const deepSearch = (arr: IRecord[]) => {
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i]
                if (item.key === selectItem.key) {
                    arr[i] = {
                        ...item,
                        options: {
                            ...item.options,
                            value,
                        },
                    }
                    curSelectItem = arr[i]
                    break
                } else if (item.type === 'grid') {
                    item?.columns?.forEach((col: any) => {
                        deepSearch(col.list)
                    })
                } else if (item.type === 'card') {
                    deepSearch(item.list)
                }
            }
            return arr
        }
        onChange(deepSearch(list))
        setSelectItem(curSelectItem)
    }
    const handleEnd = ({ oldIndex, newIndex }: SortableEvent) => {
        console.log(oldIndex, newIndex)
        if (oldIndex !== newIndex) {
            let arr = cloneDeep(list)
            ;[arr[oldIndex], arr[newIndex]] = [arr[newIndex], arr[oldIndex]]
            onChange(arr)
        }
    }
    return (
        <div className="w-[60%] border-gray-300 border-y-2 border-solid overflow-auto border-b-[2px]">
            <div className="flex justify-end h-[40px] gap-3 pl-[10px] border-solid border-b-[1px] border-[#f0f0f0]">
                <Tooltip title="预览" className=" cursor-pointer text-[#5ec829] hover:text-blue-500 text-xl">
                    <YoutubeOutlined onClick={() => previewRef.current.changeModalState()} />
                </Tooltip>
                <Tooltip title="生成代码" className=" cursor-pointer text-[#5ec829] hover:text-blue-500 text-xl">
                    <SaveOutlined onClick={() => generateCodeRef.current.changeModalState()} />
                </Tooltip>
                <Tooltip title="清空" className=" cursor-pointer text-red-300 hover:text-red-500 text-xl">
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
                        className="w-full h-full p-1"
                        ghostClass={styles['sortable-ghost']}
                        list={list}
                        setList={setList}
                        onStart={(e) => setSelectItem(list[e.oldIndex])}
                        onAdd={handleOnAdd}
                        onEnd={handleEnd}
                    >
                        {list.map((item: IRecord) => (
                            <LayoutItem
                                key={item.key}
                                record={item}
                                hideKey={hideKey}
                                config={centerData.config}
                                handleCopy={handleCopy}
                                handleDelete={handleDelete}
                                onChange={handleChange}
                                handleColAdd={handleColDragAdd}
                            />
                        ))}
                    </ReactSortable>
                </Form>
            </div>

            <Preview ref={previewRef} data={centerData} onChange={onChange} />
            <GenerateCode ref={generateCodeRef} data={centerData} />
        </div>
    )
}
export default React.memo(CenterBoard)
