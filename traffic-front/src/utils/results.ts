import request from './request'

export const getAllDetection = () => {
    return request.get('/getDetections')
}

export const deleteResults = (data: Array<any>) => {

    return request.delete('/deleteResults', { data })
}