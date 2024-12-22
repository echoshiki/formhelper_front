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

export default () => {

    // 输入框状态
    const [loginFields, setLoginFields] = useState({
        username: '',
        password: '',
        captchaInput: ''
    });

    const onChangeValue = (value: string, field: string) => {
        setLoginFields(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const { captchaLabel, login, fetchCaptcha } = useAuthStore();

    const { toast } = useToast();
    const location = useLocation();
	const navigate = useNavigate();
  
    useEffect(() => {
        // 加载获取图形验证码
        fetchCaptcha("login");
    }, []);

    const showLoginError = (message: string) => {
        toast({
            variant: "destructive",
            title: "提示",
            description: message,
        });
    }

    const handleLogin = async () => {

        // 验证字段
        const checkFields = Object.values(loginFields).every(value => 
            value !== null && value !== undefined && value !== ''
        );
        
        if (!checkFields) {
            showLoginError('必填项不能为空');
            return false;
        }

        // 提交数据验证登录
        try {
            await login({ 
                username: loginFields.username, 
                password: loginFields.password,
                captcha: loginFields.captchaInput 
            });
            const from = location.state?.from ? location.state?.from : '/';
            navigate(from);
        } catch (e) {
            showLoginError((e as Error).message);
        }
    }

    return (
        <div className="flex flex-col justify-between pt-12 h-[calc(100vh-1rem)] lg:h-[calc(100vh-5rem)] lg:w-96 lg:mx-auto">
            <div className="px-5">
                <div className="text-center">
                    <h1 className="text-3xl font-black">LOGIN</h1>
                    <p className="text-xs font-light text-gray-400 mt-2">现在立即登录的表单会员中心</p>
                </div>
                <Card className="w-full mt-10 mx-auto pt-8 pb-8">
                    <CardContent className="grid gap-2 relative">
                        <div className="grid gap-2">
                            <Label htmlFor="username" className="font-normal text-xs">用户名或者邮箱</Label>
                            <Input 
                                id="username" 
                                type="text" 
                                value={loginFields.username} 
                                onChange={e => onChangeValue(e.target.value, 'username')}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="font-normal text-xs">密码</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                value={loginFields.password} 
                                onChange={e => onChangeValue(e.target.value, 'password')} 
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="captchaInput" className="font-normal text-xs">验证码</Label>
                            <div className="flex items-center justify-between space-x-1">
                                <img 
                                    src={captchaLabel} 
                                    alt="captcha" 
                                    onClick={() => fetchCaptcha("login")} 
                                />
                                <Input 
                                    id="captchaInput" 
                                    type="text" 
                                    value={loginFields.captchaInput} 
                                    onChange={e => onChangeValue(e.target.value, 'captchaInput')} 
                                />
                            </div>
                        </div>
                        <Button className="absolute bottom-[-3.5rem] left-1/2 w-3/4 rounded-3xl py-6 translate-x-[-50%]" onClick={handleLogin}>提交</Button>
                    </CardContent>
                </Card>
            </div>
            
            <div className="pb-5">
                <p className="w-full text-center text-xs font-light">还没有账户？现在就去<a href="/register" className="underline">注册账户</a>吧！</p>
            </div>  
        </div>
        
    )
}
