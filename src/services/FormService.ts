import axiosInstance from "@/utils/axiosInstance";

// 导出返回的表单数据项结构类型
export interface formItemProps {
    id: string,
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
    fields: string,
    search?: string
}

export interface formActionProps {
    formBase: formBaseProps,
    formFields: formFieldsProps[]
}

export interface formBaseProps {
    id?: string,
    title: string,
    description: string,
    started_at: string,
    expired_at: string,
    limited: number,
    single: boolean,
    logged: boolean,
    disabled: boolean,
    count?: number,
    total_count?: number
}

export interface formFieldsProps {
    id: string,
    label: string,
    field_type: string,
    options: string[],
    required: boolean,
    sort: number,
    value?: any,
}

class FormService {
      
    /**
     * 接口服务：获取表单列表
     * @description 获取表单列表数据
     * @param {getFormListProps} params
     * @param {number} page 当前页
     * @param {number} page_size 每页数据量
     * @param {string} sort_field 排序字段
     * @param {string} sort_order 排序规则
     * @param {string} search 搜索关键词
     * @param {string} fields 指定查询的字段，逗号分隔开
     */
    async getFormList(params: getFormListProps) {
        try {
            // 直接解构出 response.data 重命名成 responseData
            const { data: responseData } = await axiosInstance.get(
                `/formhelper/form/list`, { 
                params
            });
            const { code, msg, data } = responseData;
            return code === 0
                ? { code: 200, msg: msg, data: data }
                : { code: 500, msg: msg }
        } catch(e) {
            return {
                code: 500,
                msg: (e as Error).message
            } 
        }
    }

    /**
     * 接口服务：删除选定表单
     * @description 删除选定表单
     * @param ids 选定表单的 id 集
     */
    async removeFormSelected(ids: string[]) {
        try {
            const { data: { code, msg } } = await axiosInstance.post(
                `/formhelper/form/deleteSelected`, { 
                ids 
            });
            return {
                code: code === 0 ? 200 : 500,
                msg: msg
            }  
        } catch (e) {
            return {
                code: 500,
                msg: (e as Error).message
            } 
        }   
    }

    /**
     * 接口服务：获取表单的结构详情
     * @description 获取表单的结构详情
     * @param id 表单 id
     */
    async getFormView(id: string) {
        try {
            const { data: { code, msg, data } } = await axiosInstance.get(
                `/formhelper/form/view`, {
                params: { id }
            });
            return code == 0 ? {
                code: 200,
                msg: msg,
                data: data
            } : {
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

    /**
     * 接口服务：创建表单
     * @description 创建一张包含自定义字段的表单
     * @param formBase 表单的基础信息
     * @param formFields 表单的自定义字段信息
     */
    async createForm({ formBase, formFields }: formActionProps) {
        try {
            const { data: { code, msg } } = await axiosInstance.post(
                `/formhelper/form/create`, {
                formBase,
                formFields
            });
            return code == 0 ? {
                code: 200,
                msg: msg,
                url: '/forms'
            } : {
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

    /**
     * 接口服务：修改表单
     * @description 修改表单的基础信息以及自定义字段
     * @param formBase 表单的基础信息
     * @param formFields 表单的自定义字段信息
     */
    async editForm ({ formBase, formFields }: formActionProps) {
        try {
            const { data: { code, msg } } = await axiosInstance.post(
                `/formhelper/form/edit`, {
                formBase,
                formFields
            });
            return {
                code: code == 0 ? 200 : 500,
                msg: msg
            }
        } catch (e) {
            return {
                code: 500,
                msg: (e as Error).message
            }
        }
    }

    /**
     * 接口服务：获取统计数据
     * @description 为后台首页获取展现数据
     */
    async getDataCount() {
        try {
            const { data: { code, msg, data } } = await axiosInstance.get(
                `/formhelper/form/getDataCount`
            );
            return {
                code: code === 0 ? 200 : 500,
                msg: msg,
                data: code === 0 && data
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