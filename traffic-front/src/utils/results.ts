import request from './request'

export const getAllDetection = () => {
    return request.get('/getDetections')
}

export const deleteResults = (data: Array<any>) => {

    return request.delete('/deleteResults', { data })
}


// 获取检测精度信息

export const getDetectionConf = () => {
    return request.get('/getDetectionConf')
}