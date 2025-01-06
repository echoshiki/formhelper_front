import axiosInstance from "@/utils/axiosInstance";

export interface currentUserProps {
    id?: number | null,
    username: string,
    email?: string | null,
    avatar?: string,
}

export interface userProfileProps {
    id: number,
    username: string,
    nickname: string,
    email: string,
    avatar: string,
    mobile: string,
    sex: string,
    birthday: string,
    money: number,
    score: number,
    created_at: string,
    updated_at: string
}

export interface loginProps {
    username: string,
    password: string,
    captcha: string
}

export interface registerProps {
    username: string,
    password: string,
    repassword: string,
    captcha: string,
    nickname?: string
}

export interface updateInfoProps {
    nickname: string,
    sex: string,
    birthday: string | null,
    mobile: string,
}

interface responseProps {
    code: number,
    msg: string
}

class AuthService {

    // 登录验证
    async login(loginInfo: loginProps) {
        try {
            const response = await axiosInstance.post(`/user/login`, {
                username: loginInfo.username,
                password: loginInfo.password,
                image_code: loginInfo.captcha
            });
            const { code, msg } = <responseProps>response.data;
            if (code == 0) {
                return {
                    code: 200,
                    msg: '登录成功'
                }
            } else {
                return {
                    code: 410,
                    msg: msg
                }
            }
        } catch (e) {
            return {
                code: 500,
                msg: (e as Error).message
            }
        }
    }

    // 用户登出
    async logout() {
        try {
            await axiosInstance.get(`/user/logout`);
            return {
                code: 200,
                msg: '登出成功'
            }
        } catch (e) {
            return {
                code: 500,
                msg: (e as Error).message
            }
        }        
    }

    async register(registerInfo: registerProps) {
        try {
            const response = await axiosInstance.post(`/user/register`, {
                username: registerInfo.username,
                password: registerInfo.password,
                repassword: registerInfo.repassword,
                nickname: registerInfo.nickname,
                image_code: registerInfo.captcha
            });
            const { code, msg } = <responseProps>response.data;
            if (code == 0) {
                return {
                    code: 200,
                    msg: '注册成功'
                }
            } else {
                return {
                    code: 410,
                    msg: msg
                }
            }
        } catch (e) {
            return {
                code: 500,
                msg: (e as Error).message
            }
        }    
    }

    async fetchCaptcha(captchaType: 'login' | 'register') {
        try {
            const response = await axiosInstance.get('/user/captcha/image/' + captchaType, {
                // 二进制格式
                responseType: 'arraybuffer'
            });
            // btoa() 方法用于将字符串数据转换为 Base64 数据
            const base64ImageData = btoa(
                // 通过一系列操作将二进制数据转换为字符串数据
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            return {
                code: 200,
                msg: "获取验证码成功",
                info: `data:image/png;base64,${base64ImageData}`
            }       
        } catch(e) {
            return {
                code: 500,
                msg: (e as Error).message
            } 
        }
    }

    async syncUser() {
        try {
            const response = await axiosInstance.get(`/formhelper/api/profile`);
            const { code, msg, data } = response.data; 
            if (code == 0) {
                return {
                    code: 200,
                    msg: '获取成功',
                    info: data
                }
            } else {
                return {
                    code: 401,
                    msg: msg
                }
            }
        } catch(e) {
            return {
                code: 500,
                msg: (e as Error).message
            } 
        }
    }

    async updateUser(updateInfo: updateInfoProps) {
        try {
            const response = await axiosInstance.post(`/formhelper/api/updateProfile`, {
                nickname: updateInfo.nickname,
                sex: updateInfo.sex,
                birthday: updateInfo.birthday,
                mobile: updateInfo.mobile
            });
            const { code, msg } = <responseProps>response.data;
            if (code == 0) {
                return {
                    code: 200,
                    msg: '修改成功'
                }
            } else {
                return {
                    code: 410,
                    msg: msg
                }
            }
        } catch (e) {
            return {
                code: 500,
                msg: (e as Error).message
            }
        }    
    }
}

export default new AuthService();