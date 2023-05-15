import React, { useState } from 'react'
import {
    Button,
    Cascader,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Radio,
    Select,
    Switch,
    TreeSelect,
    Card,
    Upload,
    Modal,
} from 'antd'
import { InboxOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons'
import type { RcFile, UploadProps } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
type SizeType = Parameters<typeof Form>[0]['size']

const normFile = (e: any) => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
        return e
    }
    return e?.fileList
}

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (error) => reject(error)
    })

const Detection: React.FC = () => {
    const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default')

    const onFormLayoutChange = ({ size }: { size: SizeType }) => {
        setComponentSize(size)
    }

    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [previewTitle, setPreviewTitle] = useState('')
    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
    ])
    const handleCancel = () => setPreviewOpen(false)

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile)
        }

        setPreviewImage(file.url || (file.preview as string))
        setPreviewOpen(true)
        // setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))
    }

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList)
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    )
    const beforeUpload = (file: UploadFile,fileList: object[]) => {
        console.log('Selected file:', file)
        console.log(fileList);
        
    }
    return (
        <>
            {' '}
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
                layout="horizontal"
                onValuesChange={onFormLayoutChange}
            >
                <Form.Item label="Input">
                    <Input />
                </Form.Item>
                <Form.Item label="Select">
                    <Select>
                        <Select.Option value="demo">Demo</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="DatePicker">
                    <DatePicker />
                </Form.Item>
                <Form.Item label="InputNumber">
                    <InputNumber />
                </Form.Item>
                <Form.Item label="Switch" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <Form.Item label="Button">
                    <Button>Button</Button>
                </Form.Item>
            </Form>
            <Card>
                <Form labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} layout="horizontal">
                    <Form.Item
                        name="upload"
                        label="上传图片"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        extra="上传交通图片用于交通标志识别"
                    >
                        <Upload name="logo" action="/upload.do" listType="picture">
                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Upload directory>
                            <Button icon={<UploadOutlined />}>Upload Directory</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Upload
                            // action="/"
                            listType="picture-card"
                            fileList={fileList}
                            // onPreview={handlePreview}
                            onChange={handleChange}
                            beforeUpload={(file,fileList) => beforeUpload(file,fileList)}
                        >
                            {fileList.length >= 8 ? null : uploadButton}
                        </Upload>
                        <Modal
                            open={previewOpen}
                            // title={previewTitle}
                            footer={null}
                            onCancel={handleCancel}
                        >
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </Form.Item>
                </Form>
            </Card>
        </>
    )
}

export default Detection
