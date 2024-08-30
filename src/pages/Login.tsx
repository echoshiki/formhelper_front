import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import useAuthStore from "@/stores/AuthStore"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

export default () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");

    const { captchaLabel, login, fetchCaptcha } = useAuthStore();
    const { toast } = useToast();
    
    useEffect(() => {
        fetchCaptcha("login");
    }, []);

    const onLogin = async () => {
        if (username == "") {
            toast({
                variant: "destructive",
                title: "提示",
                description: "请输入用户名",
            })
            return;
        }
        if (password == "") {
            toast({
                variant: "destructive",
                title: "提示",
                description: "请输入密码",
            })
            return;
        }
        if (captchaInput == "") {
            toast({
                variant: "destructive",
                title: "提示",
                description: "请输入图形验证码",
            })
            return;
        }
        try {
            await login({username, password, captcha: captchaInput});         
        } catch (e) {
            toast({
                variant: "destructive",
                title: "提示",
                description: (e as Error).message,
            });
        }
    }

    return (
        <Card className="w-72 md:w-96 mx-auto mt-20 pt-2 pb-4">
            <CardHeader>
                <CardTitle className="text-2xl">登录</CardTitle>
                <CardDescription>
                    输入你的账户和密码来登录系统
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="username">账户</Label>
                    <Input id="username" type="text" placeholder="m@example.com" value={username} onChange={e => setUsername(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">密码</Label>
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="captchaInput">验证码</Label>
                    <div className="flex items-center justify-between space-x-2">
                        <img src={captchaLabel} alt="captcha" onClick={() => fetchCaptcha("login")} />
                        <Input id="captchaInput" type="text" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={onLogin}>立即登录</Button>
            </CardFooter>
        </Card>
    )
}
