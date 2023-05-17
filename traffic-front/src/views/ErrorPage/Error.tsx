import React, { useState } from 'react'
import { Upload, Image } from 'antd'
import { UploadChangeParam } from 'antd/lib/upload'

interface ImageObj {
    url: string | undefined
}

const ErrorPage: React.FC = () => {
    const [fileList, setFileList] = useState<ImageObj[]>([])

    const handleChange = async (info: UploadChangeParam) => {
        console.log(info.file.uid)

        if (info.file.status != 'removed') {
            // setFileList([imageObj])
        }
    }

    return (
        <>
            <Upload
                name="image"
                action="/upload"
                listType="picture"
                onChange={handleChange}
                maxCount={1}
            >
                <button>Upload Image</button>
            </Upload>

            {fileList.length > 0 && (
                <Image src={fileList[0].url} style={{ width: '300px', marginTop: '16px' }} />
            )}
        </>
    )
}

export default ErrorPage
