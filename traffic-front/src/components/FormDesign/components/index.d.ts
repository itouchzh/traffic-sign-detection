import { CSSProperties, ReactNode } from 'react'

export interface IConfig {
    layout?: string
    labelCol?: any
    wrapperCol?: any
    required?: boolean
    customStyle?: CSSProperties
    size?: string
    disabled?: boolean
    [key: string]: any
}

export interface IRecordOptions {
    readonly?: boolean
    allowClear?: boolean
    bordered?: boolean
    disabled?: boolean
    placeholder?: string
    clearable?: boolean
    maxLength?: number
    type?: string
    rows?: number
    option?: any
    showSearch?: boolean
    size?: string
    mode?: string
    value?: any
    max?: number
    min?: number
    step?: number
    checked?: boolean
    hidden?: boolean
    picker?: string
    count?: number
    allowHalf?: boolean
    defaultValue?: Array<string> | string | number
    action?: string
    listType?: string
    accept?: string
    headers?: ReactNode | string
    name?: string
    multiple?: boolean
    alertType?: string
    showIcon?: boolean
    treeCheckable?: boolean
    treeDefaultExpandAll?: boolean
    data?: any
    [key: string]: any
}
export interface IRecord {
    label: string
    key: string
    type: string
    icon: string
    options: IRecordOptions
    rules: any
    unique: boolean
    is_inherited: boolean
    is_auth: boolean
    is_combine: boolean
    combine_item: string
    [key: string]: any
}

export type TRecord = Required<Pick<IRecord, 'options'>> & Partial<IRecord>

export interface IData {
    list: TRecord[]
    config: IConfig
}
