import axiosInstance from "@/utils/axiosInstance";

export interface formItemProps {
    id: number,
    title: string,
    description: string,
    submissions_count: number,
    expired_at: string,
    created_at: string,
    updated_at: string
}

export interface paginationProps {
    total: number,
    page: number,
    page_size: number,
    total_pages: number
}

interface getFormListResponse {
    code: number,
    msg: string,
    info?: {
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
                    info: data
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

    async removeFormItem(id: number) {
        try {
            const response = await axiosInstance.post(`/formhelper/form/delete`, {
                id: id,
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
}

export default new FormService();