import { Form } from 'antd'
import React, { useEffect } from 'react'
import AFormItem from './AFormItem'

interface FormBuildProps {
    className?: string
    value?: any
    onChange?: (value: any, key: string) => void
}
const FormBuild: React.FC<FormBuildProps> = ({
    className,
    value,
    onChange
}: FormBuildProps) => {
    useEffect(() => {
        console.log("value",value)
    })
    const handleChange = (value:any, key:string) => {
        // onChange(value, key)

    }
    return (
        <div className={className}>
            {typeof value.list !== 'undefined' &&
            typeof value.config !== 'undefined' ? (
                <Form
                    layout={value.config.layout}
                    requiredMark={value.config.hideRequiredMark}
                    style={value.config.customStyle}
                >
                    {value.list.map((record: any) => (
                        // <BuildFormBlock
                        //     key={record.key}
                        //     record={record}
                        //     config={value.config}
                        //     handleChange={handleChange}
                        // />
                        <AFormItem record={record} config={value.config} key={record.key}/>

                    ))}
                </Form>
            ) : (
                ''
            )}
        </div>
    )
}

export default FormBuild
