import axios from 'axios';

declare module 'axios' {
    interface AxiosInstance {
        (config: AxiosRequestConfig): Promise<any>
    }
}

const request = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 3000
})

request.interceptors.request.use(config => {
    return config;
})


request.interceptors.response.use(res => {
    return res.data;
}, err => {
    console.log(err, '网络错误');
})

export default request;