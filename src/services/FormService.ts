import axiosInstance from "@/utils/axiosInstance";
import { paginationProps }  from "@/hooks/useListManager";

export interface formItemProps {
    id: number,
    title: string,
    description: string,
    submissions_count: number,
    expired_at: string,
    created_at: string,
    updated_at: string
}

interface getFormListResponse {
    code: number,
    msg: string,
    data?: {
        forms: formItemProps[],
        pagination: paginationProps,
        user: number,
    }
}

interface getFormListProps {
    page: number,
    page_size: number,
    sort_field: string,
    sort_order: string,
    search: string,
}

interface getSubmissionListProps {
    form_id: number,
    page: number,
    page_size: number,
    sort_field: string,
    sort_order: string,
    search: string,
}

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

class FormService {
    // 获取个人表单列表
    async getFormList({page, page_size, sort_field, sort_order, search}: getFormListProps): Promise<getFormListResponse> {
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

    // 获取个人表单列表
    async getSubmissionList({
        form_id, 
        page, 
        page_size, 
        sort_field, 
        sort_order, 
        search
    }: getSubmissionListProps) {
        try {
            const response = await axiosInstance.get(`/formhelper/form/submissions`, {
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
            const response = await axiosInstance.post(`/formhelper/form/deleteSubmissionSelected`, {
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
}

export default new FormService();