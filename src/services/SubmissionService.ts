import axiosInstance from "@/utils/axiosInstance";

// 导出返回的提交数据项结构类型
export interface submissionItemProps {
    id: string,
    user_id: string,
    user: {
        username: string,
    },
    form: {
        title: string,
    },
    form_id: string,
    submitted_at: string
}

// 导出返回的提交数据项详情的结构类型
export interface submissionViewProps {
    fields: submissionFieldProps[],
    username: string,
    submitted_at: string
}

interface submissionFieldProps {
    id: string,
    label: string,
    field_type: string,
    sort: number,
    value: any
}

interface getSubmissionListProps {
    form_id: number,
    page: number,
    page_size: number,
    sort_field: string,
    sort_order: string,
    search: string,
}

// 提交数据的字段属性
export interface createSubmissionFieldsProps extends submissionFieldProps {
    required: boolean,
    options: string[]
}

// 提交数据
interface createSubmissionProps {
    form_id: string,
    fields: createSubmissionFieldsProps[]
}

class SubmissionService {

    /**
     * 接口服务：获取提交数据详情
     * @description 获取指定 id 的提交数据详情
     * @param {getSubmissionListProps} params 参数集
     * @param {string} form_id 表单的 id
     * @param {string} page 当前页
     * @param {string} page_size 每页显示数据量
     * @param {string} sort_field 排序字段
     * @param {string} sort_order 排序规则
     * @param {string} search 搜索关键词
     */
    async getSubmissionList(params: getSubmissionListProps) {
        try {
            const { data: { code, msg, data } } = await axiosInstance.get(
                `/formhelper/submission/list`, {
                params
            });
            return {
                code: code === 0 ? 200 : 500,
                msg: msg,
                data: code === 0 && data
            }
        } catch(e) {
            return {
                code: 500,
                msg: (e as Error).message
            } 
        }
    }

    /**
     * 接口服务：删除提交数据详情
     * @description 删除指定 id 的提交数据详情
     * @param {string} id 表单提交数据表的 id
     */
    async removeSubmissionSelected(ids: string[]) {
        try {
            const { data: { code, msg } } = await axiosInstance.post(
                `/formhelper/submission/deleteSelected`, {
                ids: ids,
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
     * 接口服务：获取提交数据详情
     * @description 获取指定 id 的提交数据详情
     * @param {string} id 表单提交数据表的 id
     */
    async getSubmissionView(id: string) {
        try {
            const { data: { code, msg, data } } = await axiosInstance.get(
                `/formhelper/submission/view`, {
                params: { id }
            });
            return {
                code: code === 0 ? 200 : 500,
                msg: msg,
                data: code === 0 && data
            }
        } catch(e) {
            return {
                code: 500,
                msg: (e as Error).message
            } 
        }
    }

    async createSubmission({ form_id, fields }: createSubmissionProps) {
        try {
            const { data: { code, msg } } = await axiosInstance.post(
                `/formhelper/submission/create`, {
                    form_id,
                    fields
                }
            )
            return {
                code: code === 0 ? 200 : 500,
                msg: msg
            }
        } catch(e) {
            return {
                code: 500,
                msg: (e as Error).message
            } 
        }
    }
}

export default new SubmissionService();