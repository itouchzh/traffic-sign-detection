import request from './request'

interface LoginParams {
    username: string,
    password: string,
    vercode: string
}

export const getCaptcha = () => {
    const now = new Date()
    return request.get(`/getCaptcha?${now.getTime()}`)
}

export const login = (params: LoginParams) => {
    
    return request.post('/login', params)
}



