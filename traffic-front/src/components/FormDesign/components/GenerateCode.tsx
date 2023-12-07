import { Modal, Tabs } from 'antd'
import React, {
    ForwardRefRenderFunction,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react'
import type { TabsProps } from 'antd'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { generateReactTSXCode } from '@/utils/formD/generate'

interface IGenerateCodeProps {
    data?: any
}
const GenerateCode: ForwardRefRenderFunction<unknown, IGenerateCodeProps> = (
    { data }: IGenerateCodeProps,
    ref
) => {
    const [isModalOpen, setModalOpen] = useState(false)
    const [reactCodeTSX, setReactCodeTSX] = useState<string>('')
    useEffect(() => {
        setReactCodeTSX(generateReactTSXCode(data as any))
    }, [data])

    const handleCancel = () => {
        setModalOpen(false)
    }
    const onChange = () => {}
    const changeModalState = () => {
        setModalOpen(!isModalOpen)
    }
    useImperativeHandle(ref, () => {
        return { changeModalState }
    })
    const exportCode = (content: any, filename: string = 'demo.tsx') => {
        const element = document.createElement('a')
        const file = `data:text/javascript;charset=utf-8,${encodeURIComponent(
            reactCodeTSX
        )}`
        element.href = file
        element.download = filename
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    const codeChange = (value: string) => {
        setReactCodeTSX(value)
    }
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'React',
            children: (
                <CodeMirror
                    value={reactCodeTSX}
                    maxHeight="500px"
                    theme="dark"
                    extensions={[
                        javascript({
                            jsx: true,
                            typescript: true,
                        }),
                    ]}
                    
                    onChange={codeChange}
                />
            ),
        },
        // {
        //     key: '2',
        //     label: 'HTML',
        //     children: 'Content of Tab Pane 2',
        // },
    ]
    return (
        <>
            <Modal
                title="生成代码"
                open={isModalOpen}
                onOk={exportCode}
                onCancel={handleCancel}
                cancelText="关闭"
                okText="导出代码"
                width={850}
                className="m-auto"
            >
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </Modal>
        </>
    )
}

export default React.memo(React.forwardRef(GenerateCode))
