import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAuthStore from "@/stores/AuthStore"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useLocation, useNavigate } from "react-router-dom"

// 页面顶部信息
const PageTop = ({ isLogin }: {
    isLogin: boolean
}) => {
    return (
        <div className="text-center">
            <h1 className="text-3xl font-black">{ isLogin 
                ? 'LOGIN' 
                : 'REGISTER' 
            }</h1>
            <p className="text-xs font-light text-gray-400 mt-2">{ isLogin 
                ? '现在立即登录的表单会员中心' 
                : '现在立即注册成为平台会员' 
            }</p>
        </div>
    )
}

interface loginFieldProps {
    type: string,
    name: string,
    label: string,
    value: string,
    isLogin: boolean
}

// 文本输入框渲染
const InputRender = ({ item, onChangeValue }: {
    item: loginFieldProps,
    onChangeValue: (value: string, name: string) => void
}) => {
    return (
        <Input 
            id={item.name} 
            type={item.type === 'captcha' ? 'text' : item.type} 
            value={item.value} 
            onChange={e => onChangeValue(e.target.value, item.name)}
        />
    )
}

// 图形验证码渲染
const CaptchaRender = ({ item, onChangeValue, captchaLabel, onFetchCaptcha }: {
    item: loginFieldProps,
    onChangeValue: (value: string, name: string) => void
    captchaLabel: string,
    onFetchCaptcha: () => void,
}) => {
    return (
        <div className="flex items-center justify-between space-x-1">
            <img 
                src={captchaLabel} 
                alt={item.name} 
                onClick={onFetchCaptcha} 
            />
            <InputRender 
                item={item} 
                onChangeValue={onChangeValue} 
            />
        </div>
    )
}

// 总的字段渲染
const FieldRender = ({ item, onChangeValue, captchaLabel, onFetchCaptcha }: {
    item: loginFieldProps,
    onChangeValue: (value: string, name: string) => void
    captchaLabel: string,
    onFetchCaptcha: () => void,
}) => {
    return (
        <div className="grid gap-2">
            <Label htmlFor={item.name} className="font-normal text-xs">{item.label}</Label>
            {item.type === 'captcha' ? (
                <CaptchaRender 
                    item={item} 
                    onChangeValue={onChangeValue}
                    captchaLabel={captchaLabel}   
                    onFetchCaptcha={onFetchCaptcha} 
                />
            ) : (
                <InputRender 
                    item={item}
                    onChangeValue={onChangeValue}
                />
            )}
        </div>
    )
}

// 页面底部信息
const PageBottom = ({ isLogin, setIsLogin }: {
    isLogin: boolean,
    setIsLogin: (bool: boolean) => void,
}) => {
    return (
        <div className="pb-5">
            {isLogin ? (
                <p className="w-full text-center text-xs font-light">还没有账户？现在就去<a href="#" className="underline" onClick={() => setIsLogin(false)}>注册账户</a>吧！</p>
            ): (
                <p className="w-full text-center text-xs font-light">已经注册过账户？现在就去<a href="#" className="underline" onClick={() => setIsLogin(true)}>登录会员</a>吧！</p>
            )}
        </div>
    )
}

export default () => {

    // 工具类
    const { toast } = useToast();
    const location = useLocation();
	const navigate = useNavigate();

    // 表单输入框状态
    const [fields, setFields] = useState([
        { type: 'text', name: 'username', label: '用户名或邮箱', value: '', isLogin: true },
        { type: 'password', name: 'password', label: '密码', value: '', isLogin: true },
        { type: 'password', name: 'repassword', label: '重复密码', value: '', isLogin: false },
        { type: 'captcha', name: 'captcha', label: '验证码', value: '', isLogin: true },
    ]);
 
    // 更新函数
    const onChangeValue = (value: string, field: string) => {
        setFields(prev => prev.map(item => item.name === field ? {
            ...item,
            value: value
        } : item ));
    };

    // 解构出图形验证码、login()、获取验证码等逻辑函数
    const { 
        captchaLabel, 
        login, 
        register, 
        fetchCaptcha,
        isLogin,
        setIsLogin
    } = useAuthStore();

    // 提示信息封装
    const showLoginError = (message: string) => {
        toast({
            variant: "destructive",
            title: "提示",
            description: message,
        });
    };

    // 根据页面类型获取图形验证码
    const handleFetchCaptcha = () => {
        const captchaType = isLogin ? 'login' : 'register';
        fetchCaptcha(captchaType);
    }

    useEffect(() => {
        // 加载时获取图形验证码
        handleFetchCaptcha();
    }, [isLogin]);

    const handleSubmit = async () => {

        // 提取字段与值 [name]: value
        const fieldValues = Object.fromEntries(
            fields.map(item => [item.name, item.value])
        );

        // some() 验证字段中只要有元素满足条件即返回 true
        const hasFieldEmpty = isLogin 
            ? fields.filter(item => item.name != 'repassword')
                .some(item => item.value == '') 
            : fields.some(item => item.value == '');
        
        if (hasFieldEmpty) {
            showLoginError('必填项不能为空');
            return false;
        }

        // 提交数据验证登录
        try {
            isLogin ? await login({ 
                username: fieldValues.username, 
                password: fieldValues.password,
                captcha: fieldValues.captcha
            }) : await register ({
                username: fieldValues.username,
                repassword: fieldValues.repassword, 
                password: fieldValues.password,
                captcha: fieldValues.captcha
            });
            // 跳转逻辑
            const from = location.state?.from || '/';
            navigate(from);
        } catch (e) {
            showLoginError((e as Error).message);
        }
    }

    return (
        <div className="flex flex-col justify-between pt-12 h-[calc(100vh-1rem)] lg:h-[calc(100vh-5rem)] lg:w-96 lg:mx-auto">
            <div className="px-5">
                <PageTop isLogin={isLogin} />
                <Card className="w-full mt-16 mx-auto pt-8 pb-8">
                    <CardContent className="grid gap-2 relative">
                        {/* 登录：筛选出 item.isLogin 都是 true 的字段 */}
                        {/* 注册：筛选出 item.isLogin 是 ture / false 的字段 */}
                        {fields.filter(item => item.isLogin || isLogin === item.isLogin)
                            .map((item, key) => (
                                <FieldRender 
                                    key={key}
                                    item={item}
                                    onChangeValue={onChangeValue}
                                    captchaLabel={captchaLabel}
                                    onFetchCaptcha={handleFetchCaptcha}
                                />
                        ))}
                        <Button className="absolute bottom-[-3.5rem] left-1/2 w-3/4 rounded-3xl py-6 translate-x-[-50%]" onClick={handleSubmit}>提交</Button>
                    </CardContent>
                </Card>
            </div>
            <PageBottom isLogin={isLogin} setIsLogin={setIsLogin} />  
        </div>  
    )
}
