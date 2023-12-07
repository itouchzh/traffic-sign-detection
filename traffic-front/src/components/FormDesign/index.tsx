import React, { useCallback, useState } from 'react'
import LeftPanel from './components/LeftPanel'
import CenterBoard from './components/CenterBoard'
import { basicsList } from './config/formItemsConfig'
import type { IData, IRecord, TRecord } from './components'
import { cloneDeep } from 'lodash'
import RightPanel from './components/RightPanel'
interface IFormDesignProps {}
const FormDesign: React.FC<IFormDesignProps> = ({}: IFormDesignProps) => {
    const [data, setData] = useState<IData>({
        list: [],
        config: {
            layout: 'horizontal',
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
            required: false,
            customStyle: '',
            size: 'middle',
            disabled: false,
        },
    })
    const [selectItem, setSelectItem] = useState<TRecord>({
        key: '',
        options: {},
    })
    const [currentDragItem, setCurrentDragItem] = useState<TRecord | null>(null)
    // set control property
    const [showProperty, setShowProperty] = useState<boolean>(false)
    // add current select item to list
    const handleClickAddList = (item: TRecord) => {
        // const currentList = cloneDeep(data.list)
        item = { ...item, key: item.type + '_' + new Date().getTime() }
        setData((prevData) => ({
            ...prevData,
            list: [...prevData.list, item],
        }))
        handleSetSelectItem(item)
    }
    
    const handleSetSelectItem = useCallback((record: TRecord) => {
        setSelectItem(record)
        setShowProperty(!!record.key)
    }, [])

    interface IValueObj {
        [key: string]: Array<string> | string
    }
    const onSelectItemChange = (valueObj: IValueObj) => {
        const keys = Object.keys(valueObj)
        let [arr, currentSelectItem] = cloneDeep([data.list, selectItem])
        const index = data.list.findIndex((item) => item.key === selectItem.key)
        if (index !== -1) {
            keys.forEach((key: any) => {
                if (selectItem[key]) {
                    currentSelectItem = {
                        ...currentSelectItem,
                        ...valueObj,
                    }
                } else if (selectItem.options?.hasOwnProperty(key)) {
                    currentSelectItem = {
                        ...currentSelectItem,
                        options: {
                            ...currentSelectItem.options,
                            ...valueObj,
                        },
                    }
                }
            })
            arr[index] = currentSelectItem
            setData({ ...data, list: arr })
            setSelectItem(currentSelectItem)
        }
    }

    const handleFormConfigChange = (item: any) => {
        const key = Object.keys(item)[0]
        const cloneList = cloneDeep(data.list)
        if (key === 'disabled') {
            cloneList.forEach((listItem: TRecord) => {
                listItem.options.disabled = item.disabled
            })
        } else if (key === 'required') {
            cloneList.forEach((listItem: TRecord) => {
                listItem.rules[0].required = item.required
            })
        }
        setData((prevData) => ({
            ...prevData,
            config: { ...prevData.config, ...item },
            list: cloneList,
        }))
    }

    return (
        <div className="flex min-w-[1000px] min-h-full">
            <LeftPanel
                basicArr={basicsList}
                generateKey={(list: TRecord[], index: number) =>
                    setCurrentDragItem({
                        ...list[index],
                        key: `${list[index].type}_${new Date().getTime()}`,
                    })
                }
                addList={handleClickAddList}
            />
            <CenterBoard
                data={data}
                onChange={(value) =>
                    setData((prev) => ({ ...prev, list: value }))
                }
                selectItem={selectItem}
                handleSelectItem={handleSetSelectItem}
                currentDragItem={currentDragItem}
            />

            <div className="border-gray-300 border-2 border-solid w-[350px]">
                <RightPanel
                    selectItem={selectItem}
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
