import React, { useEffect, useState } from 'react'
import ComTable from './components/ComTable'
import TabPanel from './components/TabPanel'
import CPie from './components/CPie'
import { getAllDetection } from '@/utils/results'
import { Card, Flex, Spin } from 'antd'
interface ResultsProps {}
const Results: React.FC = () => {
    const [deleteData, setDeleteData] = useState<Array<any>>([])
    const handleClickCheckBox = (val: any) => {
        setDeleteData(val)
    }
    const [tableData, setTableData] = useState<Array<any>>()
    const [categoryData, setCatagoryData] = useState<Array<any>>()
    const [loading, setLoading] = useState<boolean>(false)
    const [pieData, setPieData] = useState<Array<any>>()
    const getAllResultsInfo = async () => {
        setLoading(true)
        const { data: res } = await getAllDetection()
        setTableData(res[1])
        setCatagoryData(res[0])
        // 统计各个种类次数
        const pieDataArr = Object.entries(
            res[0].reduce((prev: any, curr: any) => {
                const label = curr.label
                prev[label] = (prev[label] || 0) + 1
                return prev
            }, {})
        ).map(([label, value]) => ({ type: label, value }))
        setPieData(pieDataArr)
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
                        <CPie data={pieData} />
                    </Card>
                    <Card hoverable style={{ width: '50%' }}>
                        <CPie data={pieData} />
                    </Card>
                </Flex>
            </Spin>
        </div>
    )
}

export default Results
