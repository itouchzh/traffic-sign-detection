import React, { useCallback, useEffect, useState } from 'react'
import {
    Checkbox,
    Divider,
    Form,
    Input,
    InputNumber,
    Radio,
    Select,
    Switch,
    Tabs,
} from 'antd'
import { cloneDeep } from 'lodash'
import ChangeOption from './ChangeOption'
import styles from './index.module.scss'
import type { TabsProps } from 'antd'
import { HighlightOutlined, RedditOutlined } from '@ant-design/icons'
import {
    IOptions,
    inputAttrOptions,
    sizeOptions,
    listTypeOption,
    datePickerOptions,
    buttonShapeOptions,
    buttonTypeOptions,
    alertTypeOptions,
} from '../config/options'

interface IRightPanelProps {
    className?: string
    selectItem?: any
    config?: any
    onChange: (value: any) => void
    onFormChange: (value: any) => void
    show?: boolean
}
const RightPanelProps: React.FC<IRightPanelProps> = ({
    className,
    selectItem,
    config,
    onChange,
    show,
    onFormChange,
}: IRightPanelProps) => {
    const [form] = Form.useForm()
    const { options } = selectItem
    const [currentItemAttrOptions, setCurrentItemAttrOptions] = useState<
        IOptions[] | null
    >(null)
    const [activeKey, setActiveKey] = useState<string>('tab1')
    const initFn = useCallback(() => {
        if (show) {
            let currentOptions: IOptions[] = []
            let initValues: string[] = []
            const valuesArray: string[] = inputAttrOptions.map(
                (option) => option.value
            )
            Object.keys(selectItem.options).forEach((key) => {
                if (valuesArray.includes(key)) {
                    if (selectItem.options[key] === true) {
                        initValues.push(key)
                    }

                    const optionKey = inputAttrOptions.find(
                        (option) => option.value === key
                    )
                    if (optionKey) {
                        currentOptions.push(optionKey)
                    }
                }
            })
            form.setFieldValue('value', selectItem.options.value)
            form.setFieldValue('attributes', initValues)
            setCurrentItemAttrOptions(currentOptions)
        }
    }, [selectItem, form])
    useEffect(() => {
        initFn()
        setActiveKey(show ? 'tab1' : 'tab2')
    }, [show])

    // form item change
    const onValuesChange = (changedValues: any, _: any) => {
        const firstKey = Object.keys(changedValues)[0]
        let changeValuesObj = cloneDeep(changedValues)
        if (firstKey === 'attributes') {
            changeValuesObj = generateOptionsObject(changedValues[firstKey])
        }
        onChange(changeValuesObj)
    }

    // select options change
    const onSelectOptionsChange = (value: IOptions[]) => {
        onChange({ option: value })
    }
    
    // Use each item in the array as a key to the object,  value type is boolean
    type InputAttrOptions = (typeof inputAttrOptions)[number]['value']
    const generateOptionsObject = (options: InputAttrOptions[]) => {
        const result = (currentItemAttrOptions || []).reduce((acc, item) => {
            acc[item.value] = options.includes(item.value)
            return acc
        }, {} as Record<InputAttrOptions, boolean>)
        return result
    }

    const renderCurrentComponent = () => {
        switch (selectItem.type) {
            case 'input':
                return <Input placeholder="请输入默认值" />
            case 'slider':
                return <Input placeholder="请输入默认值" />
            case 'textarea':
                return <Input placeholder="请输入默认值" />
            case 'select':
                return (
                    <Select
                        placeholder="请输入默认值"
                        className={selectItem.type === 'select' ? '' : 'hidden'}
                        mode={options.mode}
                        options={options.option}
                    />
                )
            case 'number':
                return <InputNumber />
            case 'checkbox':
                return <Checkbox.Group options={options.option} />
            case 'radio':
                return <Radio.Group options={options.option} />
            case 'date':
                return <Input placeholder="YYYY-MM-DD" />
            case 'time':
                return <Input placeholder="HH:mm:ss" />
            case 'rate':
                return <Input placeholder="请输入" />
            case 'switch':
                return <Switch checked={options.value} />
            case 'text':
                return <Input placeholder="请输入" />
            case 'html':
                return <Input.TextArea placeholder="请输入" />
            default:
                return <></>
        }
    }

    const handleFormChange = (changedValues: any) => {
        let cur = {
            ...(Object.keys(changedValues)[0] === 'labelCol'
                ? {
                      labelCol: {
                          span: changedValues['labelCol'],
                      },
                  }
                : changedValues),
        }
        onFormChange(cur)
    }

    const onRulesChange = (value: any, remark: string = '') => {
        let curValue = {
            rules: [
                {
                    ...selectItem.rules[0],
                    [remark === 'required' ? 'required' : 'message']: value,
                },
                ...selectItem.rules.slice(1),
            ],
        }
        if (remark === '') {
            curValue = {
                rules: [selectItem.rules[0], ...value],
            }
        }
        onChange(curValue)
    }

    const items: TabsProps['items'] = [
        {
            key: 'tab1',
            label: (
                <span className="ml-2">
                    <HighlightOutlined />
                    组件属性
                </span>
            ),
            children: show ? (
                <Form
                    className={`p-3 ${styles['component-property-form']}`}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    form={form}
                    onValuesChange={onValuesChange}
                >
                    <Form.Item
                        label="标签"
                        initialValue={selectItem.type}
                        name="type"
                        className="mb-1"
                    >
                        <Input
                            value={selectItem.type}
                            placeholder="请输入"
                            readOnly
                        />
                    </Form.Item>
                    <Form.Item
                        label="id"
                        initialValue={selectItem.key}
                        name="key"
                    >
                        <Input
                            value={selectItem.key}
                            placeholder="请输入"
                            readOnly
                        />
                    </Form.Item>
                    <Form.Item
                        label="标题"
                        initialValue={selectItem.title}
                        className={selectItem.title ? '' : 'hidden'}
                        name="label"
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                    {options.hasOwnProperty('placeholder') && (
                        <Form.Item
                            label="占位提示"
                            initialValue={options.placeholder}
                            name={'placeholder'}
                        >
                            <Input placeholder="请输入" />
                        </Form.Item>
                    )}

                    {options.hasOwnProperty('width') && (
                        <Form.Item
                            label="宽度"
                            initialValue={options.width}
                            name={'width'}
                        >
                            <Input placeholder="请输入" />
                        </Form.Item>
                    )}

                    <Form.Item
                        label="默认值"
                        className={
                            options.hasOwnProperty('value')
                                ? ' max-h-15 overflow-auto'
                                : 'hidden'
                        }
                        name={'value'}
                        initialValue={options.value}
                    >
                        {renderCurrentComponent()}
                    </Form.Item>

                    <Form.Item
                        className={options.rows ? '' : 'hidden'}
                        name={'rows'}
                        label="行数"
                        initialValue={options.rows}
                    >
                        <InputNumber placeholder="请输入" min={1} />
                    </Form.Item>

                    <Form.Item
                        className={
                            options.hasOwnProperty('max') ? '' : 'hidden'
                        }
                        label="最大值"
                        initialValue={options.max}
                        name={'max'}
                    >
                        <InputNumber placeholder="请输入" />
                    </Form.Item>
                    <Form.Item
                        className={
                            options.hasOwnProperty('min') ? '' : 'hidden'
                        }
                        label="最小值"
                        initialValue={options.min}
                        name={'min'}
                    >
                        <InputNumber placeholder="请输入" />
                    </Form.Item>
                    <Form.Item
                        className={options.step ? '' : 'hidden'}
                        label="步数"
                        initialValue={options.step}
                        name={'step'}
                    >
                        <InputNumber placeholder="请输入" />
                    </Form.Item>
                    {options.optionType && (
                        <Form.Item
                            label="选项类型"
                            name={'optionType'}
                            initialValue={options.optionType}
                        >
                            <Radio.Group>
                                <Radio value={'default'}>默认</Radio>
                                <Radio value={'button'}>按钮</Radio>
                            </Radio.Group>
                        </Form.Item>
                    )}

                    {['select', 'radio', 'checkbox'].includes(
                        selectItem.type
                    ) && (
                        <Form.Item wrapperCol={{ span: 24 }}>
                            <Divider orientation="center">静态数据</Divider>
                            <ChangeOption
                                type={selectItem.type}
                                options={options.option}
                                onChange={onSelectOptionsChange}
                            />
                        </Form.Item>
                    )}
                    {options.mode && (
                        <Form.Item
                            label="是否支持多选"
                            name={'mode'}
                            labelCol={{ span: 8 }}
                            initialValue={options.mode}
                        >
                            <Radio.Group>
                                <Radio value={'multiple'}>是</Radio>
                                <Radio value={'tags'}>否</Radio>
                            </Radio.Group>
                        </Form.Item>
                    )}
                    {/*  bug */}
                    {/* {options.hasOwnProperty('showInput') ? (
<Form.Item
    label="显示输入框"
    name={'showInput'}
    labelCol={{ span: 8 }}
    initialValue={options.showInput}
>
    <Switch />
</Form.Item>
) : (
''
)} */}
                    {options.size && (
                        <Form.Item
                            label="尺寸"
                            initialValue={options.size}
                            name={'size'}
                        >
                            <Radio.Group options={sizeOptions} />
                        </Form.Item>
                    )}
                    {options.picker && (
                        <Form.Item
                            name={'picker'}
                            initialValue={options.picker}
                            label="选择器类型"
                        >
                            <Select
                                options={datePickerOptions}
                                placeholder="请选择"
                            />
                        </Form.Item>
                    )}
                    {options.format && selectItem.type === 'date' && (
                        <Form.Item
                            label="日期格式"
                            name={'format'}
                            initialValue={options.format}
                        >
                            <Input placeholder="请输入格式" />
                            <a href="https://day.js.org/docs/zh-CN/display/format">
                                输入格式参考
                            </a>
                        </Form.Item>
                    )}
                    {options.format && selectItem.type === 'time' && (
                        <Form.Item
                            label="时间格式"
                            name={'format'}
                            initialValue={options.format}
                        >
                            <Input placeholder="请输入时间格式" />
                            <a href="https://day.js.org/docs/zh-CN/display/format">
                                输入格式参考
                            </a>
                        </Form.Item>
                    )}
                    {options.count && (
                        <Form.Item
                            initialValue={options.count}
                            name={'count'}
                            label="星星总数"
                        >
                            <InputNumber
                                placeholder="star总数"
                                min={1}
                                max={10}
                            />
                        </Form.Item>
                    )}

                    {options.hasOwnProperty('allowHalf') && (
                        <Form.Item
                            initialValue={options.allowHalf}
                            name={'allowHalf'}
                            label="是否允许半选"
                        >
                            <Radio.Group>
                                <Radio value={true}>允许</Radio>
                                <Radio value={false}>不允许</Radio>
                            </Radio.Group>
                        </Form.Item>
                    )}
                    {options.listType && (
                        <Form.Item
                            initialValue={options.listType}
                            name={'listType'}
                            label="类型"
                        >
                            <Select options={listTypeOption} />
                        </Form.Item>
                    )}
                    {options.action && (
                        <Form.Item
                            name={'action'}
                            label="上传地址"
                            initialValue={options.action}
                        >
                            <Input placeholder="请输入上传地址" />
                        </Form.Item>
                    )}
                    {options.name && (
                        <Form.Item
                            name={'name'}
                            label="文件参数名"
                            initialValue={options.name}
                            labelCol={{ span: 10 }}
                        >
                            <Input placeholder="请输入文件参数名" />
                        </Form.Item>
                    )}
                    {options.maxCount && (
                        <Form.Item
                            initialValue={options.maxCount}
                            name={'maxCount'}
                            label="最大上传数量"
                            labelCol={{ span: 10 }}
                        >
                            <InputNumber
                                placeholder="最大上传数量"
                                min={1}
                                max={999}
                            />
                        </Form.Item>
                    )}
                    {options.description && (
                        <Form.Item
                            name={'description'}
                            label="描述"
                            // labelCol={{ span: 10 }}
                            initialValue={options.description}
                        >
                            <Input placeholder="请输入描述" />
                        </Form.Item>
                    )}
                    {options.hasOwnProperty('directory') && (
                        <Form.Item
                            name={'directory'}
                            label="支持上传文件夹"
                            labelCol={{ span: 10 }}
                        >
                            <Switch checked={options.directory} />
                        </Form.Item>
                    )}
                    {options.hasOwnProperty('multiple') && (
                        <Form.Item
                            name={'multiple'}
                            label="是否支持多选"
                            labelCol={{ span: 10 }}
                        >
                            <Switch checked={options.multiple} />
                        </Form.Item>
                    )}
                    {options.buttonType && (
                        <Form.Item
                            name={'buttonType'}
                            label="按钮类型"
                            labelCol={{ span: 8 }}
                            initialValue={options.buttonType}
                        >
                            <Select options={buttonTypeOptions} />
                        </Form.Item>
                    )}

                    {options.shape && (
                        <Form.Item
                            name={'shape'}
                            label="按钮形状"
                            labelCol={{ span: 8 }}
                            initialValue={options.shape}
                        >
                            <Select options={buttonShapeOptions} />
                        </Form.Item>
                    )}

                    {options.alertType && (
                        <Form.Item
                            name={'alertType'}
                            label="提示类型"
                            // labelCol={{ span: 8 }}
                            initialValue={options.alertType}
                        >
                            <Select options={alertTypeOptions} />
                        </Form.Item>
                    )}

                    <Form.Item label="属性" name={'attributes'}>
                        <Checkbox.Group
                            options={currentItemAttrOptions?.map((item) => ({
                                ...item,
                                style: {
                                    minWidth: '75px',
                                },
                            }))}
                        />
                    </Form.Item>
                    {selectItem.rules.length > 0 && (
                        <Form.Item
                            name={'rules'}
                            wrapperCol={{ span: 24 }}
                            className="p-1"
                        >
                            <Divider orientation="center">校验</Divider>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="cursor-default">是否必填</span>
                                <Switch
                                    checked={selectItem.rules[0].required}
                                    onChange={(checked) =>
                                        onRulesChange(checked, 'required')
                                    }
                                />
                            </div>
                            <div className="flex items-center">
                                <div className=" min-w-[75px]">错误提示</div>
                                <Input
                                    placeholder="请输入"
                                    value={selectItem.rules[0].message}
                                    onChange={(e) =>
                                        onRulesChange(e.target.value, 'message')
                                    }
                                />
                            </div>
                            {selectItem.rules[0].required && (
                                <ChangeOption
                                    type={'rules'}
                                    options={selectItem.rules.slice(1)}
                                    onChange={onRulesChange}
                                />
                            )}
                        </Form.Item>
                    )}
                </Form>
            ) : (
                <div className="h-[500px] w-full flex justify-center items-center text-xl">
                    请添加字段
                </div>
            ),
        },
        {
            key: 'tab2',
            label: (
                <span className="ml-2">
                    <RedditOutlined />
                    表单属性
                </span>
            ),
            children: (
                <Form className="p-3" onValuesChange={handleFormChange}>
                    <Form.Item
                        label="表单布局"
                        name="layout"
                        initialValue={config.layout}
                    >
                        <Radio.Group buttonStyle="solid">
                            <Radio.Button value="horizontal">水平</Radio.Button>
                            <Radio.Button value="vertical">垂直</Radio.Button>
                            <Radio.Button value="inline">行内</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="标签宽度"
                        initialValue={config.labelCol.span}
                        name={'labelCol'}
                    >
                        <InputNumber
                            min={1}
                            max={24}
                            // value={config.labelCol.span}
                        />
                    </Form.Item>
                    <Form.Item
                        label="表单尺寸"
                        initialValue={config.size}
                        name={'size'}
                    >
                        <Radio.Group buttonStyle="solid">
                            <Radio.Button value="small">小</Radio.Button>
                            <Radio.Button value="middle">默认</Radio.Button>
                            <Radio.Button value="large">大</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="禁用表单" name={'disabled'}>
                        <Switch checked={config.disabled} />
                    </Form.Item>
                    <Form.Item label="是否必填" name={'required'}>
                        <Switch checked={config.required} />
                    </Form.Item>
                </Form>
            ),
        },
    ]
    return (
        <div className={className}>
            <div className={styles['component-tab']}>
                <Tabs
                    items={items}
                    activeKey={activeKey}
                    onChange={(key) => setActiveKey(key)}
                    size="small"
                />
            </div>
        </div>
    )
}

export default React.memo(RightPanelProps)
