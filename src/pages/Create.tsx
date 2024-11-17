import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer";
import { dateFormatter, parseDate } from "@/utils/dateFormatter";
import Header from "@/layouts/Header";
import { useState } from "react";
import FormService, { formBaseProps, formFieldsProps } from "@/services/FormService";
import { CopyPlusIcon, FileText, ListXIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";


interface OptionProps {
    value: string,
    index: number,
    onRemoveOption: (key: number) => void,
    onChangeOption: (key: number, value: string) => void,
}

const OptionItem = ({ value, index, onRemoveOption, onChangeOption }: OptionProps) => {
    return (
        <div className="flex space-x-2 items-center mt-2">
            <a href="#" onClick={() => onRemoveOption(index)}><ListXIcon size="24" /></a>
            <Input type="text" 
                placeholder="选项"
                value={value}
                onChange={e => onChangeOption(index, e.target.value)} />
        </div>
    )
}

interface FieldsProps {
    formFields: formFieldsProps[],
    onAddField: (fieldItem: formFieldsProps) => void,
    onRemoveField: (index: number) => void
}

const Fields = ({ formFields, onAddField, onRemoveField }: FieldsProps) => {
    const [field, setField] = useState<formFieldsProps>({
        label: "",
        field_type: "",
        options: ["", ""],
        required: false,
        sort: 99
    });

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // 错误信息
    const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setField({
            ...field,
            [name]: value,
        });
    };

    const handleCheckedChange = (checked: boolean, name: string) => {
        setField({
            ...field,
            [name]: checked,
        });
    };

    // 添加选项
    const handleAddOption = () => {
        const nextOptions = field.options;
        nextOptions.push("");
        setField({
            ...field,
            options: nextOptions,
        });
    };

    // 删除选项
    const handleRemoveOption = (index: number) => {
        const nextOptions = field.options.filter((_, key) => index!=key);
        setField({
            ...field,
            options: nextOptions,
        });
    };

    // 输入选项
    const handleChangeOption = (index: number, value: string) => {
        const nextOptions = field.options.slice();
        nextOptions[index] = value;
        setField({
            ...field,
            options: nextOptions,
        });
    };

    // 提交并对提交的字段进行一系列处理
    const onSubmitField = () => {
        // 验证字段
        if (!validateField()) return false;
        // 关闭抽屉
        setIsDrawerOpen(false);
        // 添加字段
        onAddField(field);
        setField({
            label: "",
            field_type: "",
            options: ["", ""],
            required: false,
            sort: 99
        });
    }

    // 验证字段填写
    const validateField = (): boolean => {
        const newFieldErrors: {[key: string]: string} = {};
        if (!field.label.trim()) {
            newFieldErrors.label = "名称不能为空";
        }
        if (!field.field_type) {
            newFieldErrors.field_type = "必须选择字段类型";
        }
        if (field.field_type === "checkbox" && field.options.every(option => !option.trim())) {
            newFieldErrors.options = "至少填写一个有效的选项";
        }
        setFieldErrors(newFieldErrors);
        return Object.keys(newFieldErrors).length === 0;
    }

    return (
        <>
            <div className="flex space-x-2">
                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <DrawerTrigger>
                        <span className="w-24 rounded  border flex items-center py-2 justify-center text-sm font-medium"><CopyPlusIcon size="20" />&nbsp;&nbsp;添加</span>
                    </DrawerTrigger>
                    <DrawerContent>
                        <div className="w-4/5 lg:w-3/4 xl:w-2/3 mx-auto max-h-[36rem] overflow-scroll">
                            <DrawerHeader>
                                <DrawerTitle>添加自定义项</DrawerTitle>
                                <DrawerDescription>在这里可以选择添加多种类型的自定义项，比如文本、数字、单选以及多选.</DrawerDescription>
                            </DrawerHeader>
                            <div className="flex flex-wrap space-y-2 px-4">

                                <div className="w-full">
                                    <Label>名称</Label>
                                    <Input type="text" 
                                        name="label"
                                        placeholder="例如姓名、年龄、手机号码等" 
                                        className="mt-2"
                                        value={field.label}
                                        onChange={handleInputChange} />
                                        {fieldErrors.label && <p className="text-red-500 text-sm mt-1">{fieldErrors.label}</p>}
                                </div>

                                <div className="w-full">
                                    <Label>类型</Label>
                                    <Select name="field_type" onValueChange={value => setField({ ...field, field_type: value })} value={field.field_type}>
                                        <SelectTrigger className="mt-2">
                                            <SelectValue placeholder="请选择字段类型" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">文本</SelectItem>
                                            <SelectItem value="radio">单选</SelectItem>
                                            <SelectItem value="checkbox">多选</SelectItem>
                                            <SelectItem value="date">日期</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {fieldErrors.field_type && <p className="text-red-500 text-sm mt-1">{fieldErrors.field_type}</p>}
                                </div>
                                {(field.field_type === 'checkbox' || field.field_type === 'radio')  && (
                                <div className="w-full">
                                    <Label>选项设置</Label>
                                    {field.options.map((item, key) => (
                                        <OptionItem key={key}
                                            index={key}
                                            value={item}
                                            onRemoveOption={handleRemoveOption}
                                            onChangeOption={handleChangeOption} />
                                    ))} 
                                    {fieldErrors.options && <p className="text-red-500 text-sm mt-1">{fieldErrors.options}</p>}                                      
                                    <Button variant="outline" 
                                        className="w-full flex items-center mt-2 text-sm"
                                        onClick={handleAddOption} >
                                        <CopyPlusIcon size="16"/>&nbsp;&nbsp;添加选项
                                    </Button>
                                </div>
                                )}
                                <div className="w-full">
                                    <Label>排序</Label>
                                    <Input type="text" 
                                        name="sort"
                                        placeholder="设置字段的顺序" 
                                        className="mt-2"
                                        value={field.sort}
                                        onChange={handleInputChange} />
                                </div>
                                <div className="w-full flex items-center space-x-5 py-5">
                                    <div>
                                        <Label>是否必填</Label>
                                        <p className="text-xs text-slate-500">该字段是否必须要填写。</p>
                                    </div>
                                    <Switch checked={field.required} 
                                        onCheckedChange={e => handleCheckedChange(e, 'required')} />
                                </div> 
                            </div>

                            <DrawerFooter>
                                <Button onClick={onSubmitField}>提交</Button>
                                <DrawerClose>
                                    <span className="w-full rounded  border flex items-center py-2 justify-center text-sm font-medium">取消</span>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>                 
                </Drawer>
            </div>
            <div className="mt-5 flex flex-wrap space-y-3 border p-5 md:p-8 rounded">
                <p className="flex items-center text-slate-600 text-xs">
                    <FileText size="12" />&nbsp;表单示例
                </p>
                {formFields.map((item, key) => (
                <div className="w-full" key={key}>
                    <Label className=" text-slate-600">
                        {item.label}{item.required && <span className="text-red-500">{` * `}</span>}
                    </Label>
                    {(item.field_type === "text" || item.field_type === "date") && (
                        <Input type="text" className="mt-2"/>
                    )}
                    {item.field_type === "checkbox" && (
                        <div className="flex items-center space-x-3 mt-2">
                        {item.options.map((option, key) => (
                            <p className="flex items-center text-sm" key={key}>
                                <Checkbox />
                                &nbsp;&nbsp;{option}
                            </p> 
                        ))}
                        </div>  
                    )}
                    {item.field_type === "radio" && (
                        <div className="flex flex-wrap space-y-2 mt-2">
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="请选择" />
                                </SelectTrigger>
                                <SelectContent>
                                {item.options.map((option, key) => (
                                    <SelectItem key={key} value={option}>{option}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        </div> 
                    )}
                </div>
                ))}
            </div>
        </>
    )
}

const Create = () => {
    const [formBase, setFormBase] = useState<formBaseProps>({
        title: '',
        description: '',
        started_at: '',
        expired_at: '',
        limited: 0,
        single: false,
        logged: false,
        disabled: false,
    });

    // 储存字段集合的状态
    const [formFields, setFormFields] = useState<formFieldsProps[]>([]);
    // 管理日期弹出框的状态
    const [isPopOpen, setIsPopOpen] = useState<{[key: string]: boolean}>({
        started_at: false,
        expired_at: false
    });

    const togglePopOpen = (field: string, status: boolean) => {
        setIsPopOpen({
            ...isPopOpen,
            [field]: status,
        });
    }
    
    // 添加字段进状态
    const handleAddField = (fieldItem: formFieldsProps) => {
        setFormFields([
            ...formFields,
            fieldItem
        ]);
        console.log(formFields);
    };

    // 删除字段出状态
    const handRemoveField = (index: number) => {
        const nextFormFields = formFields.filter((_, key) => key != index);
        setFormFields(nextFormFields);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setFormBase({
            ...formBase,
            [name]: value,
        });
    };

    const handleDateSelect = (field: 'started_at' | 'expired_at',selectedDate: Date | undefined) => {
        if (selectedDate) {
            const formattedDate = dateFormatter(selectedDate);
            setFormBase({
                ...formBase,
                [field]: formattedDate,
            });
        }
        // 关闭弹窗
        togglePopOpen(field, false);
    };

    const handleCheckedChange = (checked: boolean, name: string) => {
        setFormBase({
            ...formBase,
            [name]: checked,
        });
    };

    const handleCreateForm = async () => {
        console.log(formBase);
        console.log(formFields);
        // const response = await FormService.createForm(formBase, []);

    }

    return (
        <>
            <Header title="创建表单" />
            <Card className="pb-2 mt-2">
                <CardHeader>
                    <div className="border-b pb-3">
                        <h1 className="font-semibold text-lg">基本信息</h1>
                        <p className="text-slate-500 text-xs mt-1">这里填写表单的基础信息，例如标题、描述等等。</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap space-y-2">
                        <div className="w-full">
                            <Label>标题</Label>
                            <Input type="text" 
                                name="title"
                                placeholder="最多30个字符" 
                                className="mt-2" 
                                value={formBase.title}
                                onChange={handleInputChange} />
                        </div>
                        <div className="w-full">
                            <Label>描述</Label>
                            <Textarea name="description" 
                                placeholder="选填" 
                                className="mt-2"
                                value={formBase.description}
                                onChange={handleInputChange} />
                        </div> 
                    </div>
                </CardContent>
            </Card>

            <Card className="pb-2 mt-2">
                <CardHeader>
                    <div className="border-b pb-3">
                        <h1 className="font-semibold text-lg">字段信息</h1>
                        <p className="text-slate-500 text-xs mt-1">这里填写表单的输入项目，包含文本、单选以及多选项。</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <Fields formFields={formFields}
                        onAddField={handleAddField}
                        onRemoveField={handRemoveField} />
                </CardContent>
            </Card>

            <Card className="pb-2 mt-2">
                <CardHeader>
                    <div className="border-b pb-3">
                        <h1 className="font-semibold text-lg">其他设置</h1>
                        <p className="text-slate-500 text-xs mt-1">这里填写表单的开始时间以及过期时间等。</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap space-y-2">
                        <div className="w-full">
                            <Label>开始时间</Label>
                            <Popover open={isPopOpen.started_at} onOpenChange={(status) => togglePopOpen("started_at", status)}>
								<PopoverTrigger asChild>
									<Input type="text" 
                                        name="started_at" 
                                        className="bg-gray-100 border-none mt-2"
                                        value={formBase.started_at}
                                        onChange={handleInputChange} />
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
										mode="single"
										selected={parseDate(formBase.started_at)}
										onSelect={(date) => handleDateSelect('started_at', date)}
										defaultMonth={parseDate(formBase.started_at)}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
                        </div>
                        <div className="w-full">
                            <Label>截止时间</Label>
                            <Popover open={isPopOpen.expired_at} onOpenChange={(status) => togglePopOpen("expired_at", status)}>
								<PopoverTrigger asChild>
									<Input type="text"
                                        name="expired_at" 
                                        className="bg-gray-100 border-none mt-2"
                                        value={formBase.expired_at}
                                        onChange={handleInputChange} />
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={parseDate(formBase.expired_at)}
										onSelect={(date) => handleDateSelect('expired_at', date)}
										defaultMonth={parseDate(formBase.expired_at)}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
                        </div>
                        <div className="w-full">
                            <Label>限制人数</Label>
                            <Input type="text" 
                                name="limited"
                                placeholder="选填，留空或者0代表不限制" 
                                className="mt-2" 
                                onChange={handleInputChange}/>
                        </div>
                        
                    </div>
                    <div className="flex flex-wrap space-y-2 mt-5">
                        <div className="w-full border rounded-lg px-5 py-5 flex items-center justify-between">
                            <div>
                                <Label>限填一次</Label>
                                <p className="text-xs text-slate-500">单个用户在此次表单中是否只能填报一次。</p>
                            </div>
                            <Switch checked={formBase.single}
                                onCheckedChange={e => handleCheckedChange(e, 'single')} />
                        </div> 
                        <div className="w-full border rounded-lg px-5 py-5 flex items-center justify-between">
                            <div>
                                <Label>需要登录</Label>
                                <p className="text-xs text-slate-500">是否要求用户登录后填报此表单。</p>
                            </div>
                            <Switch checked={formBase.logged}
                                onCheckedChange={e => handleCheckedChange(e, 'logged')} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="py-5 mt-2">
                <CardContent className="p-0 pl-5">
                    <Button onClick={handleCreateForm}>确认提交</Button>
                </CardContent>
            </Card>
            
        </>
    );
}

export default Create;