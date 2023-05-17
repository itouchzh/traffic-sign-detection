import request from './request'
interface upLoadImage {
    image: string,
    name: string
}

// 检测图片，并且返回
export const uploadImages = (params: upLoadImage[]) => {
    return request.post('/getImages', params)
}