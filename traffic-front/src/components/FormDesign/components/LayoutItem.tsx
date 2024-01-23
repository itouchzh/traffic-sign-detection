import React, { useEffect } from 'react'
import { Button, Card, Col, Row, Tooltip } from 'antd'
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons'
import styles from './index.module.scss'
import { ReactSortable } from 'react-sortablejs'
import FormNode from './FormNode'
import { IRecord } from './interface'
import useClickAction from '@/hooks/useClickAction'
import { useSelectItemContext } from '@/context/useSelectItem'
interface ILayoutItemProps {
    record?: any
    config?: any
    hideKey?: boolean
    handleCopy: () => void
    handleDelete: () => void
    onChange: (value: any) => void
    handleColAdd: (evt: any, record: IRecord, index: number, type?: string) => void
}
const LayoutItem: React.FC<ILayoutItemProps> = ({
    record,
    config,
    hideKey,
    handleCopy,
    handleDelete,
    handleColAdd,
    onChange,
}: ILayoutItemProps) => {
    const {selectItem, setSelectItem} = useSelectItemContext()
    const handleSetColList = () => {}
    const handleCopyItem = useClickAction(handleCopy)
    const handleDeleteItem = useClickAction(handleDelete)
    const onClick = useClickAction(() => setSelectItem(record))
    return (
        <>
            {record.type === 'grid' && (
                <div
                    className={`${styles['form-list']} ${record.key === selectItem.key && styles['active']}`}
                    onClick={onClick}
                >
                    <Row gutter={record.options.gutter} key={record.key}>
                        {record.columns.map((colItem: any, colIndex: number) => {
                            return (
                                <Col span={colItem.span || 0} key={colIndex} className={styles['grid-col']}>
                                    <ReactSortable
                                        group="form-draggable"
                                        animation={150}
                                        tag="div"
                                        className="w-full h-full p-1 "
                                        ghostClass={styles['sortable-ghost']}
                                        list={colItem.list}
                                        setList={handleSetColList}
                                        onAdd={(evt) => handleColAdd(evt, record, colIndex)}
                                    >
                                        {colItem.list.map((item: any) => (
                                            <LayoutItem
                                                key={item.key}
                                                record={item}
                                                config={config}
                                                hideKey={hideKey}
                                                handleCopy={handleCopy}
                                                handleDelete={handleDelete}
                                                onChange={onChange}
                                                handleColAdd={handleColAdd}
                                            />
                                        ))}
                                    </ReactSortable>
                                </Col>
                            )
                        })}
                        {record.type === selectItem.type && (
                            <BottomButton
                                handleCopyItem={handleCopyItem}
                                handleDeleteItem={handleDeleteItem}
                                record={record}
                                selectItem={selectItem}
                                hideKey={hideKey}
                            />
                        )}
                    </Row>
                </div>
            )}
            {record.type === 'card' && (
                <div
                    className={`${styles['card-main']} ${record.key === selectItem.key && styles['active']}`}
                    onClick={onClick}
                >
                    <Card title={record.title} bordered={false}>
                        <ReactSortable
                            group="form-draggable"
                            animation={150}
                            tag="div"
                            className="border border-dashed border-blue-300 min-h-[50px] bg-white"
                            ghostClass={styles['sortable-ghost']}
                            list={record.list}
                            setList={handleSetColList}
                            onAdd={(evt) => handleColAdd(evt, record, 0, record.type)}
                        >
                            {record.list.map((item: any) => (
                                <LayoutItem
                                    key={item.key}
                                    record={item}
                                    config={config}
                                    hideKey={hideKey}
                                    handleCopy={handleCopy}
                                    handleDelete={handleDelete}
                                    onChange={onChange}
                                    handleColAdd={handleColAdd}
                                />
                            ))}
                        </ReactSortable>
                    </Card>
                    {record.type === selectItem.type && (
                        <BottomButton
                            handleCopyItem={handleCopyItem}
                            handleDeleteItem={handleDeleteItem}
                            record={record}
                            selectItem={selectItem}
                            hideKey={hideKey}
                        />
                    )}
                </div>
            )}
            {!['grid', 'card'].includes(record.type) && (
                <FormNode
                    record={record}
                    hideKey={hideKey}
                    config={config}
                    handleCopy={handleCopy}
                    handleDelete={handleDelete}
                    onChange={onChange}
                    key={record.key}
                />
            )}
        </>
    )
}

export default LayoutItem

interface IBottomButton {
    handleCopyItem: (e: any) => void
    handleDeleteItem: (e: any) => void
    record?: any
    selectItem?: any
    hideKey?: boolean
}
const BottomButton: React.FC<IBottomButton> = ({
    handleCopyItem,
    handleDeleteItem,
    record,
    selectItem,
    hideKey,
}: IBottomButton) => {
    return (
        <div className={`flex justify-end gap-4 h-8 items-center absolute top-0 right-0 `}>
            {/* {hideKey ? '' : <div className="text-blue-500 absolute bottom-0">{record.key}</div>} */}
            <div className={`w-15 rounded-tl-[16px] ${record.key === selectItem.key ? '' : 'hidden'}`}>
                <Tooltip title="复制">
                    <Button
                        shape="circle"
                        className="text-blue-400 cursor-pointer"
                        icon={<CopyOutlined />}
                        onClick={handleCopyItem}
                    />
                </Tooltip>
                <Tooltip title="删除">
                    <Button
                        shape="circle"
                        className="text-blue-400 cursor-pointer ml-2"
                        icon={<DeleteOutlined />}
                        onClick={handleDeleteItem}
                    />
                </Tooltip>
            </div>
        </div>
    )
}
