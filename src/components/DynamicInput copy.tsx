import { formFieldsProps } from "@/services/FormService";
// 前端填写页面获取 react-hook-form 上下文
import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { dateFormatter, parseDate } from "@/utils/dateFormatter";

/**
 * 组件：字段通用组件
 * @description 根据类型渲染各自的 UI
 * @param formField 当前字段
 * @param readOnly 是否只是展示
 * @param value 可选，当前字段的值，用于展示页面
 * @param onChange 字段输入方法
 */

interface dynamicFormProps {
    formField: formFieldsProps,
    readOnly: boolean,
    value?: any,
    onChange?: (id: string, value: any) => void, 
    type?: string, 
}

const DynamicInput = ({ formField, readOnly, value, onChange, type }: dynamicFormProps) => {

    let register = (_id: string) => {};
    let errors = {};

    const [isPopOpen, setIsPopOpen] = useState<boolean>(false);

    try {
        const formContext = useFormContext();
        if (!readOnly && formContext) {
            // 解构赋值必须加括号
           ({ register, formState: { errors } } = formContext);
        }
    } catch {
        // 不处理
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        onChange?.(name, value);
    }

    const handleDateSelect = (name: string, selectedDate: Date | undefined) => {
		if (selectedDate) {
			const value = dateFormatter(selectedDate);
			onChange?.(name, value);
		}
		// 关闭弹窗
		togglePopOpen(false);
	};

    const handleCheckedChange = (name: string, option: string, checked: boolean | string) => {
        if (checked) {
            // 如果该选项被选中
            const newOptions = value.includes(option) ? value : [...value, option];
            onChange?.(name, newOptions);
        } else {
            // 如果取消选中
            const newOptions = value.filter((item: string) => item != option);
            onChange?.(name, newOptions);
        }
    }

    const togglePopOpen = (status: boolean) => {
		setIsPopOpen(status);
	}

    const renderFieldType = (field: formFieldsProps) => {
        const fieldType = field.field_type ? field.field_type : type;
		switch (fieldType) {
			case 'text':
            case 'number':
				return (
                    <Input 
                        type={fieldType} 
                        className="mt-2" 
                        name={field.id}
                        value={value}
                        onChange={handleInputChange}
                        {...readOnly ? {} : register(field.id) } 
                    />
                );
            case 'date':
                return (
                    <Popover open={isPopOpen} onOpenChange={(status) => setIsPopOpen(status)}>
                        <PopoverTrigger asChild>
                            <Input type="text"
                                name={field.id}
                                className="bg-gray-100 border-none mt-2"
                                value={value}
                                onChange={handleInputChange} />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={parseDate(value)}
                                onSelect={(date) => handleDateSelect(field.id, date)}
                                defaultMonth={parseDate(value)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                );
			case 'textarea':
				return <Textarea 
                            name={field.id}
                            className="mt-2" 
                            value={value}
                            onChange={handleInputChange}
                            {...readOnly ? {} : register(field.id) }  
                        />;
			case 'select':
				return (
					<div className="flex flex-wrap space-y-2 mt-2">
						<Select name={field.id} onValueChange={value => onChange?.(field.id, value)} value={value}>
							<SelectTrigger>
								<SelectValue placeholder="请选择" />
							</SelectTrigger>
							<SelectContent>
								{field.options.map((option, key) => (
									<SelectItem key={key} value={option}>{option}</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				);
			case 'checkbox':
				return (
					<div className="flex items-center space-x-3 mt-2 py-1">
						{field.options.map((option, key) => (
							<p className="flex items-center text-sm" key={key}>
								<Checkbox checked={value.includes(option)} onCheckedChange={e => handleCheckedChange(field.id, option, e)} />
								&nbsp;&nbsp;{option}
							</p>
						))}
					</div>
				);
			case 'switch': 
				return <p>
                        <Switch 
                            className="mt-2" 
                            checked={value}
                            onCheckedChange={e => onChange?.(field.id, e)}
                        />
                    </p>;
            default:
                return null;
		}
	}

    return (
        <div className="w-full">
            <Label className=" text-slate-600">
                {formField.label}{formField.required ? <span className="text-red-500">{` * `}</span> : ''}
            </Label>
            {renderFieldType(formField)}	
        </div>
    )
};

export default DynamicInput;