import React, { useState } from 'react'
import { ReactSortable } from 'react-sortablejs'
import type { TRecord } from '.'
import IconFont from '@/components/SvgIcon'

interface ILeftPanelProps {
    basicArr: Array<TRecord>
    generateKey: (list: Array<TRecord>, index: number) => void
    addList: (val: TRecord) => void
}
const LeftPanel: React.FC<ILeftPanelProps> = ({
    generateKey,
    addList,
    basicArr,
}: ILeftPanelProps) => {
    const [list, setList] = useState<Array<any>>(basicArr)
    return (
        <div className="w-[20%] min-w-[290px] min-h-[50px] bg-white border-solid border-2 border-gray-300">
            <h1 className="flex items-center justify-center text-red-400 text-[20px] h-10 border-solid border-b-2 border-blue-200">
                组件
            </h1>
            <div className="flex flex-wrap justify-around items-center">
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
                    className=" p-4 flex flex-wrap justify-between gap-2 items-center"
                    sort={false}
                >
                    {list.map((item: any, index: number) => {
                        return (
                            <div
                                className="text-center w-[45%] h-[40px] p-2 flex -order-1 items-center cursor-move bg-blue-50 border-solid border
                            border-gray-300 rounded hover:border-blue-500 hover:border-dashed hover:border-2"
                                draggable
                                key={index}
                                onDragStart={() => generateKey(list, index)}
                                onClick={() => addList(item)}
                            >
                                <IconFont type={item.icon} className="mr-1" />
                                {item.label}
                            </div>
                        )
                    })}
                </ReactSortable>
            </div>
        </div>
    )
}

export default React.memo(LeftPanel)
