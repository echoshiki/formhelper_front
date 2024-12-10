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

    // 字段输入状态
    const [formFieldValues, setFormFieldValues] = useState<{[key: string]: any}>({});

    // 载入状态
    const [loading, setLoading] = useState<boolean>(false);

    // 获取表单结构数据
    const fetchInitialData = async() => {
        setLoading(true);
        try {
            const { data: responseData } = await FormService.getFormView(id);
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

    const handleSubmit = () => {
        
        const fieldsComplete = formFields.current.map(item => {
            // 筛查必填项
            if (item.required && !formFieldValues[item.id]) {
                showToast(`${item.label} 是必填项！`);
                return false;
            }
            // 将填写值赋值进字段数组
            return {
                ...item,
                value: formFieldValues[item.id] || null
            };
        });
    
        // 提交
        console.log(fieldsComplete); // 打印合并后的字段数组
    };

    return (
        <>
        {loading ? (
            <Spinner />
        ) : (
            <Card className="w-72 md:w-auto mx-auto pt-2 pb-4">
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