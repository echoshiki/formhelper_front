import axiosInstance from "@/utils/axiosInstance";

// 导出返回的表单数据项结构类型
export interface formItemProps {
    id: number,
    title: string,
    description: string,
    submissions_count: number,
    limited: number,
    started_at: string,
    expired_at: string,
    single: boolean,
    logged: boolean,
    created_at: string,
    updated_at: string,
    disabled: boolean
}

interface getFormListProps {
    page: number,
    page_size: number,
    sort_field: string,
    sort_order: string,
    search: string,
}

export interface formActionProps {
    formBase: formBaseProps,
    formFields: formFieldsProps[]
}

export interface formBaseProps {
    id: string,
    title: string,
    description: string,
    started_at: string,
    expired_at: string,
    limited: number,
    single: boolean,
    logged: boolean,
    disabled: boolean,
}

export interface formFieldsProps {
    id: string,
    label: string,
    field_type: string,
    options: string[],
    required: boolean,
    sort: number
}

class FormService {
    // 获取个人表单列表
    async getFormList({page, page_size, sort_field, sort_order, search}: getFormListProps) {
        try {
            const response = await axiosInstance.get(`/formhelper/form/list`, {
                params: {
                    page,
                    page_size,
                    sort_field,
                    sort_order,
                    search,
                }
            });
            const { code, msg, data } = response.data;
            if (code == 0) {
                return {
                    code: 200,
                    msg: msg,
                    data: data
                }
            }
            return {
                code: 500,
                msg: msg
            }
        } catch(e) {
            return {
                code: 500,
                msg: (e as Error).message
            } 
        }
    }

    async removeFormSelected(ids: number[]) {
        try {
            const response = await axiosInstance.post(`/formhelper/form/deleteSelected`, {
                ids: ids,
            });
            const { code, msg } = response.data;
            if (code == 0) {
                return {
                    code: 200,
                    msg: msg
                }
            }
            return {
                code: 500,
                msg: msg
            }  
        } catch (e) {
            return {
                code: 500,
                msg: (e as Error).message
            } 
        }   
    }

    async getFormView(id: string) {
        try {
            const response = await axiosInstance.get(`/formhelper/form/view`, {
                params: {
                    id: id,
                }
            });

            const { code, msg, data } = response.data;
            if (code == 0) {
                
                return {
                    code: 200,
                    msg: msg,
                    data: data
                }
            }
            return {
                code: 500,
                msg: msg,
                data: []
            } 
        } catch (e) {
            return {
                code: 500,
                msg: (e as Error).message
            } 
        }
    }

    async createForm({formBase, formFields}: formActionProps) {
        try {
            const response = await axiosInstance.post(`/formhelper/form/create`, {
                formBase: formBase,
                formFields: formFields
            });
            const { code, msg } = response.data;
            if (code == 0) {
                return {
                    code: 200,
                    msg: msg,
                    url: '/forms'
                }
            }
            return {
                code: 500,
                msg: msg
            }
        } catch (e) {
            return {
                code: 500,
                msg: (e as Error).message
            } 
        }
    }

    async editForm ({formBase, formFields}: formActionProps) {
        console.log(formBase);
        console.log(formFields);
        try {
            const response = await axiosInstance.post(`/formhelper/form/edit`, {
                formBase: formBase,
                formFields: formFields
            });
            const { code, msg } = response.data;
            if (code == 0) {
                return {
                    code: 200,
                    msg: msg
                }
            }
            return {
                code: 500,
                msg: msg
            }
        } catch (e) {
            return {
                code: 500,
                msg: (e as Error).message
            }
        }
    }
}

export default new FormService();