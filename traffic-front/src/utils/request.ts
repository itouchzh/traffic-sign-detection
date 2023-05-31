import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { message, notification } from "antd";
import { getLocalStorage } from './storage';
// 定义接口返回类型
interface ResponseData {
    code: number;
    message: string;
    data: any;
}

// 错误信息
const codeMessage: { [key: number]: string } = {
    200: "服务器成功返回请求的数据。",
    201: "新建或修改数据成功。",
    202: "一个请求已经进入后台排队（异步任务）。",
    204: "删除数据成功。",
    400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
    401: "用户没有权限（令牌、用户名、密码错误）。",
    403: "用户得到授权，但是访问是被禁止的。",
    404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
    406: "请求的格式不可得。",
    410: "请求的资源被永久删除，且不会再得到的。",
    422: "当创建一个对象时，发生一个验证错误。",
    500: "服务器发生错误，请检查服务器。",
    502: "网关错误。",
    503: "服务不可用，服务器暂时过载或维护。",
    504: "网关超时。",
};


// 创建一个Axios实例
const instance: AxiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:5000/', // 设置基础URL
    timeout: 30000, // 请求超时时间
    withCredentials: false,
});

// 添加请求拦截器
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getLocalStorage<string>('token')
        if (token) {
            config.headers['Authorization'] = token
        }
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
        const { response } = error
        if (response && response.status) {
            const errorText = codeMessage[response.status] || response.statusText;
            const { status, config } = response;
            notification.error({
                message: `请求错误 ${status}: ${config.url}`,
                description: errorText,
            });
            
        } else if (!response) {
            notification.error({
                description: "请求失败，客户端异常或网络问题，请清除缓存！",
                message: "状态异常",
            });
        }
        // 对响应错误做些什么
        return Promise.reject(error);
    },
);

export default instance;

