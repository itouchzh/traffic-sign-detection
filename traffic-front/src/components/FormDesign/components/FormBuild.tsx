import { Form } from 'antd'
import React, { useEffect } from 'react'
import AFormItem from './AFormItem'
import { cloneDeep } from 'lodash'
import { IData, IRecord } from './interface'
import { useSelectItemContext } from '@/context/useSelectItem'

interface FormBuildProps {
    className?: string
    data?: any
    onChange?: (list: IRecord[]) => void
}
const FormBuild: React.FC<FormBuildProps> = ({ className, data, onChange }: FormBuildProps) => {
    const { selectItem, setSelectItem } = useSelectItemContext()
    const handleChange = (val: any) => {
        const { type, key } = selectItem
        let value = ['input', 'textarea'].includes(type as string) ? val.target.value : val
        const changeItem = (arr: IRecord[]) => {
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i]
                if (item.key === key) {
                    arr[i] = {
                        ...item,
                        options: {
                            ...item.options,
                            value,
                        },
                    }
                    setSelectItem(arr[i])
                    break
                } else if (item.type === 'grid') {
                    item?.columns?.forEach((col: any) => {
                        changeItem(col.list)
                    })
                } else if (item.type === 'card') {
                    changeItem(item.list)
                }
            }
            return arr
        }
        onChange && onChange(changeItem(data.list))
    }

    return (
        <div className={className}>
            {typeof data?.list !== 'undefined' && typeof data.config !== 'undefined' ? (
                <Form
                    layout={data.config.layout}
                    requiredMark={data.config.hideRequiredMark}
                    style={data.config.customStyle}
                >
                    {data.list.map((record: any) => (
                        <AFormItem
                            record={record}
                            config={data.config}
                            key={record.key}
                            onChange={handleChange}
                            onPreviewChange={handleChange}
                        />
                    ))}
                </Form>
            ) : (
                ''
            )}
        </div>
    )
}

export default FormBuild
