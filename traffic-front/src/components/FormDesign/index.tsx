import React, { useCallback, useEffect, useMemo, useState } from 'react'
import LeftPanel from './components/LeftPanel'
import CenterBoard from './components/CenterBoard'
import type { IData, IRecord } from './components/interface'
import { cloneDeep } from 'lodash'
import RightPanel from './components/RightPanel'
import { useSelectItemContext } from '@/context/useSelectItem'
interface IFormDesignProps {}
const FormDesign: React.FC<IFormDesignProps> = ({}: IFormDesignProps) => {
    const [data, setData] = useState<IData>({
        list: [],
        config: {
            layout: 'horizontal',
            labelCol: { span: 5 },
            wrapperCol: { span: 17 },
            required: false,
            customStyle: {},
            size: 'middle',
            disabled: false,
        },
    })
    const { selectItem, setSelectItem } = useSelectItemContext()
    const [currentDragItem, setCurrentDragItem] = useState<IRecord | null>(null)
    // set control property
    const [showProperty, setShowProperty] = useState<boolean>(false)
    // add current select item to list
    const handleClickAddList = (item: IRecord) => {
        item = { ...item, key: item.type + '_' + new Date().getTime() }
        setData((prevData) => ({
            ...prevData,
            list: [...prevData.list, item],
        }))
        handleSetSelectItem(item)
    }
    const handleSetSelectItem = useCallback((record: IRecord) => {
        console.log(record)
        setSelectItem(record)
        setShowProperty(!!record.key)
    }, [])

    useEffect(() => {
        setShowProperty(selectItem.key ? true : false)
    }, [selectItem])

    interface IValueObj {
        [key: string]: Array<string> | string
    }
    const onSelectItemChange = (valueObj: IValueObj) => {
        const keys = Object.keys(valueObj)
        let [cloneList, currentSelectItem] = cloneDeep([data.list, selectItem])
        // 这里只对第一层进行了处理，也需要考虑到容器里面的情况，所以需要递归遍历
        const deepSearch = (array: IRecord[]) => {
            for (let i = 0; i < array.length; i++) {
                const item = array[i]
                if (item.key === selectItem.key) {
                    // 找到当前节点并执行替换处理
                    keys.forEach((key: any) => {
                        if (selectItem.hasOwnProperty(key)) {
                            array[i] = {
                                ...item,
                                ...valueObj,
                            }
                        } else if (selectItem.options?.hasOwnProperty(key)) {
                            array[i] = {
                                ...item,
                                options: {
                                    ...item.options,
                                    ...valueObj,
                                },
                            }
                        }
                    })
                    currentSelectItem = array[i]
                    break
                } else if (item.type === 'grid') {
                    item.columns &&
                        item.columns.forEach((col: any) => {
                            deepSearch(col.list)
                        })
                } else if (item.type === 'card') {
                    deepSearch(item.list)
                }
            }
            return array
        }

        const res = deepSearch(cloneList)
        setData({ ...data, list: res })
        setSelectItem(currentSelectItem)
    }

    const handleFormConfigChange = (item: any) => {
        const key = Object.keys(item)[0]
        const cloneList = cloneDeep(data.list)
        if (key === 'disabled') {
            cloneList.forEach((listItem: IRecord) => {
                listItem.options!.disabled = item.disabled
            })
        } else if (key === 'required') {
            cloneList.forEach((listItem: IRecord) => {
                listItem.rules![0].required = item.required
            })
        }
        setData((prevData) => ({
            ...prevData,
            config: { ...prevData.config, ...item },
            list: cloneList,
        }))
    }

    return (
        <div className="flex h-[775px]">
            <LeftPanel
                generateKey={(list: IRecord[], index: number) =>
                    setCurrentDragItem({
                        ...list[index],
                        key: `${list[index].type}_${new Date().getTime()}`,
                    })
                }
                addList={handleClickAddList}
            />
            <CenterBoard
                data={data}
                onChange={(value) => setData((prev) => ({ ...prev, list: value }))}
                currentDragItem={currentDragItem}
            />

            <div className="border-gray-300 border-2 border-solid w-[350px]">
                <RightPanel
                    onChange={onSelectItemChange}
                    onFormChange={handleFormConfigChange}
                    config={data.config}
                    show={showProperty}
                />
            </div>
        </div>
    )
}

export default React.memo(FormDesign)
