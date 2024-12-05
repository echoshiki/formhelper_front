import DynamicInput from "@/components/DynamicInput"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import FormService, { formFieldsProps } from "@/services/FormService"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"

const View = () => {

    const { id } = useParams();
    if (!id) return;

    let formBase = useRef({
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

    let formFields = useRef([]);

    const [formFieldValues, setFormFieldValues] = useState<{[key: string]: any}>({}); // 用户输入的值

    // 获取表单数据
    const fetchInitialData = async() => {
        const response = await FormService.getFormView(id);
        
        if (response && response.data) {
            formBase.current = response.data.base;
            formFields.current = response.data.fields;
             // 初始化用户输入值
             const initialValues = response.data.fields.reduce((acc: any, field: any) => {
                acc[field.id] = ''; // 设置默认值
                return acc;
            }, {});
            setFormFieldValues(initialValues);   
        }  
    }
    
    useEffect(() => {
        fetchInitialData();
    }, [id]);

    const handleValueChange = (name: string, value: any) => {
        setFormFieldValues({
            ...formFieldValues,
            [name]: value,
        })
    }

    const handleSubmit = () => {
        // 提交
        console.log(formFieldValues);

    }

    return (
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
                        onChange={handleValueChange} 
                        value={formFieldValues[field.id]} 
                    />
                ))}
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={handleSubmit}>立即登录</Button>
            </CardFooter>
        </Card>
    );
}

export default View;