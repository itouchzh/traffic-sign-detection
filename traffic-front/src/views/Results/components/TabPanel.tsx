import { Button, Col, Input, Row } from 'antd'
import React, { useEffect, useState } from 'react'

interface TabPanelProps {
    data?: Array<any>
}
const TabPanel: React.FC<TabPanelProps> = ({ data = [] }) => {
    const [value, setValue] = useState<string>()
    const [disabled, setDisabled] = useState<boolean>(true)
    const handleSearchResult = () => {}
    const handleDeleteResult = () => {
        console.log(1)
    }
    useEffect(() => {
        setDisabled(!!data.length ? false : true)
    }, [data])
    return (
        <div>
            <Row>
                <Col span={2}>
                    <Button danger onClick={handleDeleteResult} disabled={disabled}>
                        删除
                    </Button>
                </Col>
                <Col span={8}>
                    <Input
                        placeholder="请输入id查找"
                        value={value}
                        onChange={(e: any) => setValue(e.target.value)}
                    />
                </Col>
                <Col offset={1}>
                    <Button type="primary" onClick={handleSearchResult}>
                        查找结果
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

export default React.memo(TabPanel)
