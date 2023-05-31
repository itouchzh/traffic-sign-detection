import request from './request'

interface LoginParams<T> {
    username: T,
    password: T,
    vercode: T
}

interface user<T> {
    id?: T,
    username: T,
    password?: T,
    email?: T,
    phone?: T,
    address?: T,
    status?: T,
    carNumber?: T,
    carId?: T
}

export const getCaptcha = () => {
    const now = new Date()
    return request.get(`/getCaptcha?${now.getTime()}`)
}

export const login = (params: LoginParams<string>) => {
    return request.post('/login', params)
}


export const getAllUsers = () => {
    return request.get('/getAllUsers')
}


export const addOneUser = (params: user<string>) => {
    return request.post('/addOneUser', params)
}


export const editUserById = (params: user<string>) => {
    return request.post(`/changeUser/${params.id}`, params)
}

export const deleteUserById = (id: string) => {
    return request.delete(`/deteteUser/${id}`)
}


export const findUserById = (id: string) => {
    return request.post('/getOneUser', { id: id })
}
