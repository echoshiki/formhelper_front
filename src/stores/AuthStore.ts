import { create } from 'zustand';
import AuthService, { currentUserProps, loginProps, registerProps } from '@/services/AuthService'

interface authStateProps {
    currentUser: currentUserProps | null,
    clearCurrentUser: () => void,
    captchaLabel: string,
    message: string | null,
    setMessage: (message: string | null) => void,
    login: (loginInfo: loginProps) => Promise<void>,
    logout: () => Promise<void>,
    register: (registerInfo: registerProps) => Promise<void>,
    syncUser: () => Promise<void>,
    fetchCaptcha: (type: "login" | "register") => Promise<void>,
    initialize: () => void,
    isLogin: boolean,
    setIsLogin: (bool: boolean) => void,
}

const getUserFromLocalStorage = (): { username: string } | null => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
};

const useAuthStore = create<authStateProps>((set) => ({
    currentUser: getUserFromLocalStorage(),
    message: null,
    captchaLabel: '',
    isLogin: true,

    // 设置登录/注册页面的类型
    setIsLogin: (bool) => {
        set({ isLogin: bool });
    },

    clearCurrentUser: () => {
        set({ currentUser: null });
    },

    setMessage: (message) => {
        set({ message });
    },

    // localStorage 获取值无法做到更新页面
    // 所以新建一个初始化方法
    initialize: () => {
        set({
            currentUser: getUserFromLocalStorage(),
        })
    },

    login: async (loginInfo) => {
        try {
            const response = await AuthService.login(loginInfo);
            if (response.code == 200) {
                const responseSync = await AuthService.syncUser();
                if (responseSync.code == 200) {
                    localStorage.setItem('currentUser', JSON.stringify(responseSync.info));
                    set({
                        currentUser: responseSync.info,
                        message: response.msg,
                    });
                }
            } else {
                set({
                    currentUser: null,
                    message: response.msg,
                });
            }
        } catch (e) {
            set({ message: (e as Error).message });
        }
    },

    logout: async () => {
        try {
            const response = await AuthService.logout();
            if (response.code == 200) {
                localStorage.removeItem('currentUser');
                set({
                    currentUser: null,
                    message: response.msg,
                });
            }
        } catch (e) {
            set({ message: (e as Error).message });
        }
    },

    register: async (registerInfo) => {
        try {
            const response = await AuthService.register(registerInfo);
            if (response.code == 200) {
                set({
                    // 注册成功跳回到登录页面
                    isLogin: true,
                    message: response.msg,
                });
            } else {
                set({
                    message: response.msg,
                });
            }
        } catch (e) {
            set({ message: (e as Error).message });
        }
    },

    syncUser: async () => {
        try {
            const response = await AuthService.syncUser();
            if (response.code == 200) {
                const userInfo = {
                    id: response.info.id,
                    username: response.info.username,
                    avatar: response.info.avatar,
                    email: response.info.email
                }
                localStorage.setItem('currentUser', JSON.stringify(userInfo));
                set({
                    currentUser: userInfo,
                    message: response.msg,
                });
            } else {
                set({
                    currentUser: null,
                    message: response.msg,
                });
            }
        } catch (e) {
            set({ message: (e as Error).message });
        }
    },

    fetchCaptcha: async (type: "login" | "register") => {
        try {
            const response = await AuthService.fetchCaptcha(type);
            if (response.code == 200) {
                set({
                    captchaLabel: response.info,
                })
            } 
        } catch (e) {
            set({ message: (e as Error).message });
        }
    }
}));

export default useAuthStore;