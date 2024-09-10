import { useState, useEffect } from "react";

export interface paginationProps {
    page: number,
    page_size: number,
    total_pages?: number,
    total?: number
}

interface sortProps {
    field: string,
    order: string
}

// 列表数据的获取、分页、排序和搜索等逻辑
// useListManager 泛型 T 表示数据项的类型
export default function useListManager<T> (
    fetchService: (param: any) => Promise<any>,
    initialParams: any = {},
    initialPagination: paginationProps = { page: 1, page_size: 10 },
    initialSort: sortProps = { field: "id", order: "desc" }
) {
    // 列表数据
    const [items, setItems] = useState<T[]>([]); // 泛型 T 表示不同数据的类型
    // 分页信息
    const [pagination, setPagination] = useState(initialPagination);
    // 排序规则
    const [sort, setSort] = useState(initialSort);
    // 关键词筛选
    const [searchKeyword, setSearchKeyword] = useState("");
    // 载入状态
    const [loading, setLoading] = useState(true); 

    const fetchData = async () => {
        setLoading(true);
        const params = {
            ...initialParams,
            page: pagination.page,
            page_size: pagination.page_size,
            sort_field: sort.field,
            sort_order: sort.order,
            search: searchKeyword
        };
        const response = await fetchService(params);
        setItems(response.data?.items || []);
        setPagination(response.data?.pagination);
        setLoading(false);
    }

    const handleSetPage = (page: number) => {
        setPagination((prev) => ({ ...prev, page }));
    }

    const handleSetPageSize = (pageSize: number) => {
        setPagination((prev) => ({ 
            ...prev, 
            page: 1,
            page_size: pageSize
        }));
    }

    const handleSearchButton = (keyword: string) => {
        setSearchKeyword(keyword);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handleSetSort = (field: string) => {
        // 重复点击的情况切换排序规则
        const order = field == sort.field
            ? (sort.order === 'desc') 
                ? 'asc' 
                : 'desc'
            : sort.order;
        setSort({ field, order });
    }

    useEffect(() => {
        fetchData();
    }, [pagination.page, pagination.page_size, searchKeyword, sort]);

    return {
        items,
        setItems,
        pagination,
        sort,
        loading,
        handleSearchButton,
        handleSetPage,
        handleSetPageSize,
        handleSetSort
    }
}
