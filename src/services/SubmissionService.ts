import axiosInstance from "@/utils/axiosInstance";

// 导出返回的提交数据项结构类型
export interface submissionItemProps {
    id: number,
    user_id: number,
    user: {
        username: string,
    },
    form: {
        title: string,
    }
    form_id: number,
    submitted_at: string
}

// 导出返回的提交数据项详情的结构类型
export interface submissionViewProps {
    fields: submissionFieldProps[],
    username: string,
    submitted_at: string
}

interface submissionFieldProps {
    id: number,
    label: string,
    value: string,
    field_type: string
}

interface getSubmissionListProps {
    form_id: number,
    page: number,
    page_size: number,
    sort_field: string,
    sort_order: string,
    search: string,
}

interface getSubmissionViewProps {
    id: number
}

class SubmissionService {

    // 获取提交数据列表
    async getSubmissionList({
        form_id, 
        page, 
        page_size, 
        sort_field, 
        sort_order, 
        search
    }: getSubmissionListProps) {
        try {
            const response = await axiosInstance.get(`/formhelper/submission/list`, {
                params: {
                    form_id,
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

    async removeSubmissionSelected(ids: number[]) {
        try {
            const response = await axiosInstance.post(`/formhelper/submission/deleteSelected`, {
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

    // 获取提交数据的详情
    async getSubmissionView({ id }: getSubmissionViewProps) {
        try {
            const response = await axiosInstance.get(`/formhelper/submission/view`, {
                params: {
                    id
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

}

export default new SubmissionService();