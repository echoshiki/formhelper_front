import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { dateFormatter, parseDate } from "@/utils/dateFormatter";

import { useForm } from "react-hook-form"
import DynamicInput from "./DynamicInput";

// 表单构造器字段属性
export interface formBuilderFieldsProps {
    name: string,
    label: string,
    type: string,
    required: boolean,
    value?: string | [] | {} | boolean,
    options?: string[]
}

interface formBuilderProps {
    fields: formBuilderFieldsProps[],
    isDragDrop: boolean,
    onSave: () => void,
}

const FormBuilder = ({ fields, isDragDrop, onSave }: formBuilderProps) => {
    const form = useForm();
    

    const onSubmit = (values: any) => {
        console.log(values);
        // 提交逻辑
        onSave();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {fields.map((item, key) => (
                <FormField
                    key={key}
                    control={form.control}
                    name={String(item.name)} 
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{item.label}</FormLabel>
                            <FormControl>
                                <DynamicInput 
                                    name={String(item.name)} 
                                    type={item.type}
                                    options={item.options} 
                                    field={field}
                                />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} 
                />
                ))} 
                <Button type="submit">确认提交</Button>
            </form>
        </Form>
    )
}

export default FormBuilder;