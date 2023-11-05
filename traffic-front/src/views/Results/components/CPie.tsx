import React, { useState, useEffect } from 'react'
import { Pie } from '@ant-design/plots'
interface CPieProps {
    data?: Array<any>
}
const CPie: React.FC<CPieProps> = ({ data = [] }) => {
    // const data = [
    //     {
    //         type: '分类一',
    //         value: 27,
    //     },
    //     {
    //         type: '分类二',
    //         value: 25,
    //     },
    //     {
    //         type: '分类三',
    //         value: 18,
    //     },
    // ]
    const config: any = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.9,
        label: {
            type: 'inner',
            offset: '-30%',
            content: ({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`,
            style: {
                fontSize: 14,
                textAlign: 'center',
            },
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    }
    return (
        <div>
            <h1 className="text-2xl">检测分类</h1>
            <Pie {...config} />
        </div>
    )
}

export default React.memo(CPie)
