import React from 'react'
import { Column } from '@ant-design/plots'
interface ChartDataInf {
    type?: string
    value?: number
}
interface CBarProps {
    data: ChartDataInf[]
}
const CBar: React.FC<CBarProps> = ({ data }) => {
    const config: any = {
        data,
        xField: 'type',
        yField: 'value',
        label: {
            // 可手动配置 label 数据标签位置
            position: 'middle',
            // 'top', 'bottom', 'middle',
            // 配置样式
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        meta: {
            type: {
                alias: '类别',
            },
            value: {
                alias: '数目',
            },
        },
    }
    return (
        <div>
            <Column {...config} />
        </div>
    )
}

export default React.memo(CBar)
