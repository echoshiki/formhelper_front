import { useEffect, useState } from "react";
import { dateFormatter } from "@/utils/dateFormatter";
import FormService, { formBaseProps, formFieldsProps } from "@/services/FormService";

/**
 * 创建与修改通用的表单 hook
 * @param id 表单的 id
 * @description 通过是否传递 id 参数来判断创建或者修改
 */
export default function useFormManager (id: string | null) {
    // 表单的基础数据
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
    // 表单的自定义字段数据
	const [formFields, setFormFields] = useState<formFieldsProps[]>([]);
    // 载入状态
    const [loading, setLoading] = useState(true); 
    // 错误信息
	const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});


    // 管理日期弹出框的状态
    const [isPopOpen, setIsPopOpen] = useState<{ [key: string]: boolean }>({
		started_at: false,
		expired_at: false
	});
    const togglePopOpen = (field: string, status: boolean) => {
		setIsPopOpen({
			...isPopOpen,
			[field]: status,
		});
	}

    // 编辑页面：获取表单初始数据
    const fetchInitialData = async() => {
        if (!id) return;
        setLoading(true);
        const response = await FormService.getFormView(id);
        if (response && response.data) {
            setFormBase(response.data.base);
            setFormFields(response.data.fields);
        } 
        setLoading(false);
    }

    // 验证字段填写
	const validateForm = (): boolean => {
		const newFormErrors: { [key: string]: string } = {};
		if (!formBase.title.trim()) {
			newFormErrors.title = "标题不能为空";
		}
		if (formFields.every(option => !option)) {
			newFormErrors.formFields = "至少添加一个有效的填写项";
		}
		setFormErrors(newFormErrors);
		return Object.keys(newFormErrors).length === 0;
	}

    // 添加字段进状态
	const handleAddField = (fieldItem: formFieldsProps) => {
		setFormFields([
			...formFields,
			fieldItem
		]);
	};

    // 删除字段出状态
	const handRemoveField = (index: number) => {
		const nextFormFields = formFields.filter((_, key) => key != index);
		setFormFields(nextFormFields);
	};

    // 处理表单输入
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = event.target;
		setFormBase({
			...formBase,
			[name]: value,
		});
	};

    // 处理日期选择后逻辑
    const handleDateSelect = (field: 'started_at' | 'expired_at', selectedDate: Date | undefined) => {
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

    // 处理选择输入
    const handleCheckedChange = (checked: boolean, name: string) => {
		setFormBase({
			...formBase,
			[name]: checked,
		});
	};

    // 处理拖拽完成事件
	const handleDragEnd = (result: any) => {
		const { source, destination } = result;

		// 如果没有目标位置，直接返回
		if (!destination) return;

		// 重新排序字段
		const reorderedFields = Array.from(formFields);
		const [movedField] = reorderedFields.splice(source.index, 1);
		reorderedFields.splice(destination.index, 0, movedField);
		setFormFields(reorderedFields);
	};

    useEffect(() => {
        fetchInitialData();
    }, [id]);

    return {
        loading,
        formBase,
        formFields,
        isPopOpen,
        togglePopOpen,
        formErrors,
        handleAddField,
        handRemoveField,
        handleInputChange,
        handleDateSelect,
        handleCheckedChange,
        handleDragEnd,
        validateForm,
    }
}