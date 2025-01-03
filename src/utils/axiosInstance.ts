import axios from "axios"
import useAuthStore from "@/stores/AuthStore";
import { getConfig } from "@/config";

const axiosInstance = axios.create({
    baseURL: getConfig().VITE_API_URL,
    timeout: 10000,
    withCredentials: true
});

// 动态更新 baseURL
axiosInstance.interceptors.request.use((config) => {
    config.baseURL = getConfig().VITE_API_URL; // 动态设置 baseURL
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        const authStore = useAuthStore.getState();
        // 会话过期处理
        if (response.data.code === 401) {
            authStore.clearCurrentUser();
            localStorage.clear(); // 清除 localStorage 中的用户信息
            authStore.setMessage(response.data.message);
            // 判断当前路径是否为 register 页面，如果是，则不跳转到登录页
            if (window.location.pathname !== '/register') {
                // 跳转到登录页
                console.log(window.location.pathname);
                // window.location.href = '/login';
            }
        }
        // 返回数据
        return response;
    },
    (error) => {
        return Promise.reject(error); // 向上抛出错误，让组件可处理个性化的错误
    }
);

export default axiosInstance;