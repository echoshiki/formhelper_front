import DynamicInput from "@/components/DynamicInput";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import FormService, { formBaseProps, formFieldsProps } from "@/services/FormService";
import useAuthStore from "@/stores/AuthStore";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { showToast } from "@/utils/common";
import { Spinner } from "@/components/package/Spinner";
import SubmissionService, { createSubmissionFieldsProps } from "@/services/SubmissionService";
import LandingPage from "@/components/LandingPage";

const View = () => {

    const { id } = useParams();
    if (!id) return;

    // 表单基础信息初始结构
    let formBase = useRef<formBaseProps>({
        id: '',
        title: '',
        description: '',
        started_at: '',
        expired_at: '',
        limited: 0,
        single: false,
        logged: false,
        disabled: false,
        count: 0,
    });
    // 字段信息
    let formFields = useRef<formFieldsProps[]>([]);

    // 检查表单是否需要登录填写
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuthStore();
    
    if (formBase.current.logged && currentUser === null) {
        // 检测登陆情况
        navigate('/login', {
            state: {
                from: location.pathname
            }
        });
    }

    const [submitted, setSubmitted] = useState(false);

    // 字段输入状态
    const [formFieldValues, setFormFieldValues] = useState<{[key: string]: any}>({});

    // 载入状态
    const [loading, setLoading] = useState<boolean>(false);

    // 获取表单结构数据
    const fetchInitialData = async() => {
        setLoading(true);
        try {
            const { data: responseData } = await FormService.getFormView(id);

            // 检测是否被禁止
            responseData.base.disabled && navigate('/error');

            // 检测是否到期
            responseData.base.expired_at && new Date(responseData.base.expired_at) < new Date() && navigate('/error');

            // 检测是否超过最大填写次数
            responseData.base.limited && responseData.base.total_count >= responseData.base.limited && navigate('/error');

            // 检测是否限填一次
            if (responseData.base.count > 0 && responseData.base.single) {
                setSubmitted(true);
                setLoading(false);
                return false;
            }

            formBase.current = responseData.base;
            formFields.current = responseData.fields;   
            
            // 初始化用户输入值
            const initialValues = responseData.fields.reduce((acc: any, field: any) => {
                acc[field.id] = ''; // 设置默认值
                return acc;
            }, {});

            setFormFieldValues(initialValues);  
            setLoading(false); 
        } catch (e) {
            showToast((e as Error).message);
        }   
    }
    
    useEffect(() => {
        fetchInitialData();
    }, [id]);

    // 将字段输入值更新进状态数组
    const handleValueChange = (name: string, value: any) => {
        setFormFieldValues({
            ...formFieldValues,
            [name]: value,
        })
    }

    const handleSubmit = async () => {

        // 为传递数据新构造一个对应结构的数组
        const fieldsComplete: createSubmissionFieldsProps[] = [];

        // 检测验证各个字段
        for (const item of formFields.current) {
            if (item.required && !formFieldValues[item.id]) {
                showToast(`${item.label} 是必填项！`);
                // 清空数组
                fieldsComplete.splice(0, fieldsComplete.length);
                break;
            } 
            fieldsComplete.push({
                ...item,
                value:  formFieldValues[item.id]
            });
        }

        // 如果字段数组为空，则返回 false
        if (fieldsComplete.length  == 0) 
            return false;

        // 通过验证，则继续提交数据
        const response = await SubmissionService.createSubmission({ 
            form_id: id,
            fields: fieldsComplete 
        });

        showToast(`${response.msg}`, response.code === 200 ? 1 : 2);

        // 跳转页面
        response.code == 200 && setSubmitted(true);
    };

    return (
        <>
        {/* 载入数据 */}
        {loading && <Spinner />}
        {/* 提交后页面 */}
        {!loading && submitted && (
            <LandingPage
                coverPhoto="confirmed"
                title="提交成功"
                description="太好了，我们很快就会收到您的提交"
            />
        )}
        {/* 表单页面 */}
        {!loading && !submitted && (
            <Card className="w-full md:w-auto mx-auto pt-2 pb-4">
                <CardHeader>
                    <CardTitle className="text-2xl">{formBase.current.title}</CardTitle>
                    <CardDescription className="">
                        {formBase.current.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">               
                    {formFields.current.map((field: formFieldsProps, key: number) => (
                        <DynamicInput 
                            key={key}
                            name={field.id} 
                            type={field.field_type}
                            label={field.label}
                            options={field.options} 
                            required={field.required} 
                            onChange={handleValueChange} 
                            value={formFieldValues[field.id]} 
                        />
                    ))}
                </CardContent>
                <CardFooter className="flex flex-wrap">                
                    <Button className="w-full" onClick={handleSubmit}>立即提交</Button>
                </CardFooter>
            </Card>
        )} 
        </>
    );
}

export default View;