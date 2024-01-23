import React, { useEffect, useRef, useState } from 'react'
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
    message,
} from 'antd'
import { InboxOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons'
import type { RcFile, UploadProps } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import { uploadImages } from '@/utils/upload'
import { useForm } from 'antd/es/form/Form'
import FButton from '@/components/FButton'
import { useAuthContext } from '@/context/authContext'
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
    // const { role } = useAuthContext()
    const role = 'admin'
    const permission = useRef<boolean>(role === 'admin' ? true : false)

    const videoRef = useRef<HTMLVideoElement | null>(null)
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

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList)
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

    // const getCamera = () => {
    //     navigator.mediaDevices
    //         .getUserMedia({ video: true })
    //         .then(function (stream) {
    //             console.log(stream)
    //             // 将摄像头流分配给video元素
    //             videoRef.current!.srcObject = stream
    //         })
    //         .catch(function (error) {
    //             console.error('Error accessing camera:', error)
    //         })
    // }

    const getCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current!.srcObject = stream;
    
          // 创建WebSocket连接
          const socket = new WebSocket('ws://localhost:5000/dcenter');
          
          // 监听WebSocket连接打开
          socket.addEventListener('connect', (event) => {
            console.log('WebSocket连接已打开');
            // 将视频流传输到后端
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = (e) => {
              if (e.data.size > 0) {
                socket.send(e.data);
              }
            };
            mediaRecorder.start();
          });
    
          // 监听WebSocket消息
          socket.addEventListener('message', (event) => {
            console.log('Received message:', event.data);
            // 在此处处理后端返回的检测结果
          });
        } catch (error) {
          console.error('Error accessing camera:', error);
        }
      };
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
                <Form.Item label="模型选择" name="modelSelect" initialValue="yolosg">
                    <Select onChange={handleSelectModel} options={options}></Select>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12 }} label="IoU阈值" name="iou">
                    <Row>
                        <Col span={12}>
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
                <Form.Item wrapperCol={{ span: 12 }} label="置信度阈值" name="conf">
                    <Row>
                        <Col span={12}>
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
                <Form.Item label="上传视频">
                    <Button type="primary" onClick={() => getCamera()}>
                        获取摄像头
                    </Button>
                </Form.Item>
                <Form.Item label="开始检测">
                    <Button type="primary" htmlType="submit">
                        开始检测
                    </Button>
                </Form.Item>
            </Form>
            <div className="w-full flex justify-around items-center flex-nowrap">
                <div className="flex justify-center items-center w-[450px] flex-col">
                    <h1 className="text-2xl">获取结果</h1>
                    <video controls height="300" width={'400'} autoPlay ref={videoRef}></video>
                </div>
                <div className="flex justify-center items-center w-[450px] flex-col">
                    <h1 className="text-2xl">检测结果</h1>
                    <video controls height="300" width={'400'}>
                        <source src={require('../../assets/video/11.mp4')} />
                    </video>
                </div>
            </div>
            <FButton />
        </>
    )
}

export default Detection
