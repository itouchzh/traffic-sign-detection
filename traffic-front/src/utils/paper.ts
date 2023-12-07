import request from './request'

export const getPaper = (id: number) => {
    return request.post('/get_pdf', {
        // responseType: 'blob',
        id
    }, {
        responseType: 'blob'
    })
}

