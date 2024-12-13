import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { dateFormatter, parseDate } from "@/utils/dateFormatter";
import { Label } from "./ui/label";

/**
 * 组件：字段通用组件
 * @description 根据类型渲染各自的 UI
 * @param formField 当前字段
 * @param value 可选，当前字段的值，用于展示页面
 * @param onChange 字段输入方法
 */

interface dynamicInputProps {
    name: string,
    type: string,
    label: string,
    options?: string[],
    required?: boolean,
    value?: any,
    onChange?: (id: string, value: any) => void, 
}

const DynamicInput = ({ name, type, label, options, required, value, onChange }: dynamicInputProps) => {

    // 管理日期弹窗打开和关闭
    const [isPopOpen, setIsPopOpen] = useState<boolean>(false);

    // 处理输入框
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        onChange?.(name, value);
    }

    // 处理日期选择框
    const handleDateSelect = (name: string, selectedDate: Date | undefined) => {
		if (selectedDate) {
			const value = dateFormatter(selectedDate);
			onChange?.(name, value);
		}
		// 关闭弹窗
		togglePopOpen(false);
	};

    // 处理多选框
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

    // 切换弹出框状态
    const togglePopOpen = (status: boolean) => {
		setIsPopOpen(status);
	}

    // 根据类型渲染 DOM 组件
    const renderInput = () => {
        switch (type) {
            case 'text':
            case 'number':
                return (
                    <Input 
                        className="mt-2" 
                        name={name}
                        type={type}
                        value={value}
                        onChange={handleInputChange}
                    />
                );
            case 'date':
                return (
                    <Popover open={isPopOpen} onOpenChange={(status) => setIsPopOpen(status)}>
                        <PopoverTrigger asChild>
                            <Input 
                                type="text"
                                name={name}
                                className="bg-gray-100 border-none mt-2"
                                value={value}
                                onChange={handleInputChange} 
                            />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={parseDate(value)}
                                onSelect={(date) => handleDateSelect(name, date)}
                                defaultMonth={parseDate(value ?? new Date())}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                );
            case 'textarea':
                return  <Textarea 
                            className="mt-2" 
                            name={name}
                            value={value}
                            onChange={handleInputChange} 
                        />;
            case 'select':
                return (
                    <div className="flex flex-wrap space-y-2 mt-2">
                        <Select name={name} onValueChange={value => onChange?.(name, value)} value={value}>
                            <SelectTrigger>
                                <SelectValue placeholder="请选择" />
                            </SelectTrigger>
                            <SelectContent>
                                {options?.map((option, key) => (
                                    <SelectItem key={key} value={option}>{option}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );
            case 'checkbox':
                return (
                    <div className="flex items-center space-x-3 mt-2 py-1">
                        {options?.map((option, key) => (
                            <p className="flex items-center text-sm" key={key}>
                                <Checkbox checked={value?.includes(option)} onCheckedChange={e => handleCheckedChange(name, option, e)} />
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
                            onCheckedChange={e => onChange?.(name, e)}
                        />
                    </p>;
            default:
                return null;
        }
    }

    return (
        <div className="w-full">
            <Label className=" text-slate-600">
                {label}{required ? <span className="text-red-500">{` * `}</span> : ''}
            </Label>
            {renderInput()}
        </div>
    )
    
};

export default DynamicInput;