import request from './request'

export function addError(data: any) {
    return request.post('/addError', data, {
        baseURL: 'http://127.0.0.1:5001/',
    })
}

export function getError() {
    return request.get('/getError', {
        baseURL: 'http://127.0.0.1:5001/',
    })
}
