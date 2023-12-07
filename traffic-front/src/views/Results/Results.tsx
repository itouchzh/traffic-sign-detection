import React, { useEffect, useState } from 'react'
import ComTable from './components/ComTable'
import TabPanel from './components/TabPanel'
import CPie from './components/CPie'
import { getAllDetection, getDetectionConf } from '@/utils/results'
import { Card, Flex, Spin } from 'antd'
import CBar from './components/CBar'
import FButton from '@/components/FButton'
interface ChartData {
    pieData: Array<any>
    chartData: Array<any>
}
interface ResultsProps {}
const Results: React.FC = () => {
    const [deleteData, setDeleteData] = useState<Array<any>>([])
    const handleClickCheckBox = (val: any) => {
        setDeleteData(val)
    }
    const [tableData, setTableData] = useState<Array<any>>()
    const [categoryData, setCatagoryData] = useState<Array<any>>()
    const [loading, setLoading] = useState<boolean>(false)
    const [chartData, setChartData] = useState<ChartData>({
        pieData: [],
        chartData: [],
    })
    const getAllResultsInfo = async () => {
        setLoading(true)
        const { data: confRes } = await getDetectionConf()
        const { data: res } = await getAllDetection()
        // 处理饼图
        const detectionResArr: { type: string; value: number }[] = [
            { type: '0.5及以下', value: 0 },
            { type: '0.5-0.6', value: 0 },
            { type: '0.6-0.7', value: 0 },
            { type: '0.7-0.8', value: 0 },
            { type: '0.8-0.9', value: 0 },
            { type: '0.9-1.0', value: 0 },
        ]

        confRes.forEach((item: any) => {
            const confidence = item.confidence
            const index = Math.floor(confidence * 10) - 4

            if (index >= 0 && index < detectionResArr.length) {
                detectionResArr[index] = {
                    ...detectionResArr[index],
                    value: detectionResArr[index].value + 1,
                }
            }
        })
        console.log(detectionResArr)

        setTableData(res[1])
        setCatagoryData(res[0])

        // 统计各个种类次数
        const chartDataArr = Object.entries(
            res[0].reduce((prev: any, curr: any) => {
                const label = curr.label
                prev[label] = (prev[label] || 0) + 1
                return prev
            }, {})
        ).map(([label, value]) => ({ type: label, value }))
        setChartData((prev) => {
            return {
                ...prev,
                pieData: detectionResArr,
                chartData: chartDataArr,
            }
        })
        // setPieData(pieDataArr)
        setLoading(false)
    }
    useEffect(() => {
        getAllResultsInfo()
    }, [])
    return (
        <div>
            <div className="mb-3">
                <TabPanel data={deleteData} />
            </div>
            <Spin spinning={loading}>
                <ComTable onClickCheckBox={handleClickCheckBox} data={tableData} />

                <Flex gap="middle" vertical={false}>
                    <Card hoverable style={{ width: '50%' }}>
                        <CBar data={ chartData.chartData}></CBar>
                    </Card>
                    <Card hoverable style={{ width: '50%' }}>
                        <CPie data={chartData.pieData} />
                    </Card>
                </Flex>
            </Spin>
            <FButton></FButton>
        </div>
    )
}

export default Results
