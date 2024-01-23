import { setLocalStorage } from '@/utils/storage'
import { LoginParams, login } from '@/utils/user'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface User {
    id?: string
    username: string
    password?: string
    email?: string
    phone?: string
    address?: string
    status?: string
    carNumber?: string
    carId?: string
    [key: string]: any
}

const initialState = {
    user: {} as User,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
    },
    // extraReducers: (builder) => {
    //     // 处理异步 action 的状态变化
    //     builder.addCase(loginUser.fulfilled, (state, action) => {
    //         state.user = action.payload.data?.userInfo as User
    //     })
    // },
})
// 定义异步 action 以处理用户登录
export const loginUser = createAsyncThunk('user/loginUser', async (userData: LoginParams<string>, { dispatch }) => {
    try {
        const response = await login(userData)
        // 将用户信息存储到 Redux store
        dispatch(setUser(response.data.userInfo))
        setLocalStorage('token',response.data.token)
        return response.data.userInfo
    } catch (error) {
        // 处理登录失败的情况
        console.error('Login failed', error)
        throw error
    }
})

export const { setUser } = userSlice.actions

export default userSlice.reducer
