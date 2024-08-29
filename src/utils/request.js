import axios from "axios";

// 定义一个变量，记录公共的前缀，baseURL
const baseURL = 'api';
const instance = axios.create({ baseURL })

// 添加响应拦截器
instance.interceptors.response.use(
    result => {
        // 成功的回调(状态码为200)
        return result.data;
    },
    err => {
        // 失败的回调(状态码非200)
        alert("服务异常")
        // 异步状态转为失败状态
        return Promise.reject(err);
    }
)

// 将实例暴露到外界
export default instance