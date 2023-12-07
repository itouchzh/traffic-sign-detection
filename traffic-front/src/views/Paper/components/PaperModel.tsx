import React from 'react'
import { Button, Drawer, Modal, Space, Watermark } from 'antd'

const placeholder = (
    <div
        style={{
            height: 300,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(150, 150, 150, 0.2)',
        }}
    >
        A mock height
    </div>
)

interface PaperModelProps {}
const PaperModel: React.FC = () => {
    const [showModal, setShowModal] = React.useState(false)

    const closeModal = () => setShowModal(false)
    const pdfFilePath = require('../../../assets/pdf/paper1.pdf')
    return (
        <>
            <Space>
                <Button onClick={() => setShowModal(true)}>Show in Modal</Button>
            </Space>

            <Modal
                destroyOnClose
                open={showModal}
                title="YOLO"
                onCancel={closeModal}
                onOk={closeModal}
                okText="确定"
                cancelText="取消"
                className=" h-screen"
                style={{ top: 0, height: '500px' }}
                width={1200}
            >
                <Watermark content="YOLO">
                    <embed
                        className="w-full h-screen"
                        src={pdfFilePath}
                        style={{ height: 'calc(100vh - 150px)' }}
                        type="application/pdf"
                    ></embed>
                </Watermark>
            </Modal>
        </>
    )
}

export default PaperModel
