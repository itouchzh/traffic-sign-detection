import request from './request'

interface LoginParams {
    username: string,
    password: string,
    captcha: string
}

export const getCaptcha = () => {
    const now = new Date()
    return request.get(`/getCaptcha?${now}`)
}

export const login = (params: LoginParams) => {
    return request.post('/login', params)
}



