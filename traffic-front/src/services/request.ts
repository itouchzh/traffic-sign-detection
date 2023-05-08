import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 定义接口返回类型
interface ResponseData {
    code: number;
    message: string;
    data: any;
}

// 创建一个Axios实例
const instance: AxiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:5000/', // 设置基础URL
    timeout: 10000, // 请求超时时间
});

// 添加请求拦截器
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {

        // 在发送请求之前做些什么
        return config;
    },
    (error: AxiosError) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    },
);

// 添加响应拦截器
instance.interceptors.response.use(
    (response: AxiosResponse<ResponseData>) => {
        // 对响应数据做些什么
        const { code, message, data } = response.data;
        if (response.status === 200) {
            return response;
        } else {
            return Promise.reject(message);
        }
    },
    (error: AxiosError) => {
        // 对响应错误做些什么
        return Promise.reject(error);
    },
);

export default instance;

