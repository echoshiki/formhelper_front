import axios from "axios"
import useAuthStore from "@/stores/AuthStore";
import config from "@/config"

const baseUrl = config.API_BASE_URL;
const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    withCredentials: true
});

axiosInstance.interceptors.response.use(
    (response) => {
        const authStore = useAuthStore.getState();
        // 会话过期处理
        if (response.data.code === 401) {
            authStore.clearCurrentUser();
            localStorage.clear(); // 清除 localStorage 中的用户信息
            authStore.setMessage(response.data.message);

            // 跳转到登录页
            window.location.href = '/login';
        }
        // 返回数据
        return response;
    },
    (error) => {
        return Promise.reject(error); // 向上抛出错误，让组件可处理个性化的错误
    }
);

export default axiosInstance;