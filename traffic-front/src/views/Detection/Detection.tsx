import React, { useEffect, useState } from 'react'
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
    Image,
    Row,
    Col,
    Slider,
} from 'antd'
import { InboxOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons'
import type { RcFile, UploadProps } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import { uploadImages } from '@/utils/upload'
import { useForm } from 'antd/es/form/Form'
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

const options = [
    {
        label: 'YOLOv5',
        value: 'yolov5',
    },
    {
        label: 'YOLO-SG',
        value: 'yolosg',
    },
    {
        label: 'YOLOv7',
        value: 'yolov7',
    },
    {
        label: 'EDN-YOLO',
        value: 'ednyolo',
    },
]
const Detection: React.FC = () => {
    const [form] = useForm()
    const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default')

    const onFormLayoutChange = ({ size }: { size: SizeType }) => {
        setComponentSize(size)
    }

    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [previewTitle, setPreviewTitle] = useState('交通标志检测')
    const handleCancel = () => setPreviewOpen(false)
    // 预览
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile)
        }

        setPreviewImage(file.url || (file.preview as string))
        setPreviewOpen(true)
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))
    }

    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [tempFileList, setTempFileList] = useState<UploadFile[]>([])
    //  上传状态改变时候的图片，需要调用三次
    // const handleChange: UploadProps['onChange'] = ({
    //     file: newFile,
    //     fileList: newFileList,
    //     event: e,
    // }) => {
    //     setFileList([])
    //     if (newFile.status !== 'removed') {
    //         setFileList((value) => [...value, ...newFileList])
    //         setTempFileList([...newFileList])
    //     }
    // }
    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList)
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    )

    // 得到目前的图
    const [currentImages, setCurrentImages] = useState<string[]>([])
    const getCurrentImages = async () => {
        const cur = await Promise.all(
            fileList.map(async (item, index) => await getBase64(item.originFileObj as RcFile))
        )
        setCurrentImages(cur)
    }
    interface detectionImageResults {
        img: string
        detectionInfo?: Object[]
        objectNum?: number
    }

    // 移除图片时候：
    const handleRemove = (file: UploadFile) => {
        setFileList((prevFileList) =>
            prevFileList.filter((item) => {
                return item.uid !== file.uid
            })
        )
    }
    useEffect(() => {
        // console.log(fileList)
        getCurrentImages()
    }, [fileList])
    // iou
    const [inputValue, setInputValue] = useState(0.25)

    const onSliderChange = (newValue: number | null) => {
        setInputValue(newValue as number)
    }
    // conf
    const [confInputValue, setConfInputValue] = useState(0.45)
    const onSliderConfChange = (newValue: number | null) => {
        setConfInputValue(newValue as number)
    }

    // 结果图片
    const [detectionResults, setDetectionResults] = useState<detectionImageResults[]>([])
    const onFinish = async (values: any) => {
        console.log(values, inputValue, confInputValue)
        console.log(form.getFieldsValue())
        const sendImages = await Promise.all(
            fileList.map(async (item, index) => {
                return {
                    image: await getBase64(item.originFileObj as RcFile),
                    name: item.uid,
                    conf: confInputValue,
                    iou: inputValue,
                    model_name: form.getFieldValue('modelSelect'),
                    isSave: form.getFieldValue('save'),
                }
            })
        )
        const { data: res } = await uploadImages(sendImages)
        setDetectionResults([...res.results])
    }
    const handleSelectModel = () => {}
    return (
        <>
            <Form
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 6 }}
                layout="horizontal"
                onValuesChange={onFormLayoutChange}
                onFinish={onFinish}
                form={form}
            >
                {/* <Form.Item label="" wrapperCol={{ span: 24 }}>
                    <Form.Item label="input" className=" inline-block">
                        <Input placeholder="请"></Input>
                    </Form.Item>
                    <Form.Item label="input" className=" inline-block  ml-8">
                        <Input placeholder="请"></Input>
                    </Form.Item>
                </Form.Item> */}
                <Form.Item label="模型选择" name="modelSelect" initialValue="yolosg">
                    <Select onChange={handleSelectModel} options={options}></Select>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24 }} label="IoU阈值" name="iou">
                    <Row>
                        <Col span={20}>
                            <Slider
                                defaultValue={inputValue}
                                min={0}
                                max={1}
                                step={0.01}
                                onChange={onSliderChange}
                                value={typeof inputValue === 'number' ? inputValue : 0}
                            />
                        </Col>
                        <Col span={4}>
                            <InputNumber
                                min={0}
                                max={1}
                                step={0.01}
                                style={{ margin: '0 16px' }}
                                value={inputValue}
                                onChange={onSliderChange}
                            />
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24 }} label="置信度阈值" name="conf">
                    <Row>
                        <Col span={20}>
                            <Slider
                                defaultValue={confInputValue}
                                min={0}
                                max={1}
                                step={0.01}
                                onChange={onSliderConfChange}
                                value={typeof confInputValue === 'number' ? confInputValue : 0}
                            />
                        </Col>
                        <Col span={4}>
                            <InputNumber
                                min={0}
                                max={1}
                                step={0.01}
                                style={{ margin: '0 16px' }}
                                value={confInputValue}
                                onChange={onSliderConfChange}
                            />
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item label="保存记录" valuePropName="checked" name="save" initialValue={true}>
                    <Switch />
                </Form.Item>
                <Form.Item label="开始检测">
                    <Button type="primary" htmlType="submit">
                        开始检测
                    </Button>
                </Form.Item>
            </Form>
            <Card>
                <Form labelCol={{ span: 12 }} wrapperCol={{ span: 24 }} layout="horizontal">
                    {/* <Form.Item
                        name="upload"
                        label="上传图片"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        extra="上传交通图片用于交通标志识别"
                    >
                        <Upload name="logo" action="" listType="picture">
                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Upload directory>
                            <Button icon={<UploadOutlined />}>Upload Directory</Button>
                        </Upload>
                    </Form.Item> */}
                    <Form.Item>
                        <h1 className="text-2xl mb-2">请上传图片</h1>
                        <Upload
                            action=""
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            multiple={true}
                            onRemove={handleRemove}
                            // beforeUpload={(file, fileList) => beforeUpload(file, fileList)}
                        >
                            {fileList.length >= 8 ? null : uploadButton}
                        </Upload>
                        <Modal
                            open={previewOpen}
                            title={previewTitle}
                            footer={null}
                            onCancel={handleCancel}
                        >
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </Form.Item>
                </Form>
            </Card>
            <h1 className=" m-5 text-2xl">原始图片</h1>
            <Card>
                <Image.PreviewGroup>
                    {currentImages.map((item, index) => (
                        <Image key={index} style={{ width: '384px' }} src={item}></Image>
                    ))}
                </Image.PreviewGroup>
            </Card>
            <h1 className="m-5 text-2xl">检测结果图</h1>
            <Card>
                <Image.PreviewGroup>
                    {detectionResults.map((item, index) => (
                        <Image key={index} style={{ width: '384px' }} src={item.img}></Image>
                    ))}
                </Image.PreviewGroup>
            </Card>
        </>
    )
}

export default Detection
