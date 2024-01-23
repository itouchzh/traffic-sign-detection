import React, { useState } from 'react'
import { ReactSortable } from 'react-sortablejs'
import type { IRecord } from './interface'
import IconFont from '@/components/SvgIcon'
import { Collapse, CollapseProps } from 'antd'
import styles from './index.module.scss'
import { basicList, layoutComponentList } from '../config/formItemsConfig'

interface ILeftPanelProps {
    basicArr?: Array<IRecord>
    generateKey: (list: Array<IRecord>, index: number) => void
    addList: (val: IRecord) => void
}
const LeftPanel: React.FC<ILeftPanelProps> = ({ generateKey, addList }: ILeftPanelProps) => {
    const [basicsList, setBasicsList] = useState<Array<any>>(basicList)
    const [layoutComponentsList, setLayoutcomponentsList] = useState<Array<any>>(layoutComponentList)
    // const []

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: '布局组件',
            children: (
                <DraggableList
                    list={layoutComponentsList}
                    generateKey={generateKey}
                    addList={addList}
                    setList={setLayoutcomponentsList}
                />
            ),
        },
        {
            key: '2',
            label: '通用组件',
            children: (
                <DraggableList list={basicsList} generateKey={generateKey} addList={addList} setList={setBasicsList} />
            ),
        },
    ]
    return (
        <div
            className={`${styles['left-panel']} relative w-[20%] min-w-[290px] bg-white border-solid border-2 border-gray-300 border-r-gray-100`}
        >
            <div className="grid place-items-center h-10 bg-white border-solid border-b border-gray-100">
                <h1 className="cursor-default text-blue-400 text-[20px]">常用组件</h1>
            </div>
            <main className={styles['left-main']}>
                <Collapse items={items} ghost defaultActiveKey={['1', '2']} />
            </main>
        </div>
    )
}

export default React.memo(LeftPanel)

// as a component
interface IDraggableListProps {
    list: Array<any>
    setList: React.Dispatch<React.SetStateAction<any[]>>
    generateKey: (list: Array<IRecord>, index: number) => void
    addList: (val: IRecord) => void
}
const DraggableList = ({ list, setList, generateKey, addList }: IDraggableListProps) => {
    return (
        <ReactSortable
            list={list}
            setList={setList}
            group={{
                name: 'form-draggable',
                pull: 'clone',
                put: false,
            }}
            animation={150}
            tag="div"
            className="px-4 flex flex-wrap justify-between gap-2 items-center"
            sort={false}
        >
            {list.map((item, index) => (
                <div
                    className="text-center w-[45%] h-[35px] p-2 flex items-center cursor-move bg-blue-50 border-solid border
                          border-gray-300 rounded hover:border-blue-500 hover:border-dashed hover:border"
                    draggable
                    key={index}
                    onDragStart={() => generateKey(list, index)}
                    onClick={() => addList(item)}
                >
                    <IconFont type={item.icon} className="mr-1" />
                    {item.label}
                </div>
            ))}
        </ReactSortable>
    )
}
