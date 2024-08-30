import { useEffect, useState } from "react";
import FormService, { formItemProps, paginationProps } from "@/services/FormService";
import dateFormatter from "@/utils/dateFormatter";

import Header from "@/layouts/Header";
import { PaginationInfo, PaginationSimple } from "@/components/Pagination";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Spinner } from "@/components/package/Spinner";
import { toast } from "@/components/ui/use-toast";
import { ChevronsUpDown, CirclePlus, PencilRuler, Search, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/SearchBar";
import { IsSure } from "@/components/package/IsSure";

const FormItem = ({ formItem, onRowAction, checkedList, onCheckedItem }: {
    formItem: formItemProps,
    onRowAction: (id: number, action: string) => void,
    checkedList: number[],
    onCheckedItem: (id: number) => void,
}) => {
    return (
        <TableRow>
            <TableCell className="w-12">
                <Checkbox className="flex items-center"
                    checked={checkedList.includes(formItem.id) ? true : false}
                    onCheckedChange={() => onCheckedItem(formItem.id)} />
            </TableCell>
            <TableCell className="w-96">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="text-left">
                            {formItem.title}
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{formItem.description}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </TableCell>
            <TableCell className="font-mono">
                <Badge variant={`${new Date(formItem.expired_at) < new Date() ? "destructive" : "secondary" }`} >{dateFormatter(new Date(formItem.expired_at))}</Badge>
            </TableCell>
            <TableCell className="font-mono">
                <Badge variant="secondary">{dateFormatter(new Date(formItem.created_at))}</Badge>
            </TableCell>
            <TableCell>
                <a className="cursor-pointer flex items-center">
                    <Search className="w-3.5 h-3.5 mr-1" />
                    {formItem.submissions_count}
                </a>
            </TableCell>
            <TableCell className="text-right">
                <div className="h-full flex space-x-2">
                    <PencilRuler className="w-3.5 h-3.5 cursor-pointer" />
                    <IsSure 
                        title="确认删除么？"
                        description="表单删除之后，随之对应的表单数据会一同删除且无法恢复，再次确认，是否需要删除？"
                        onConfirm={() => onRowAction(formItem.id, 'delete')}>
                        <Trash2 className="w-3.5 h-3.5 cursor-pointer" />
                    </IsSure>
                </div>
            </TableCell>
        </TableRow>
    );
}

interface formListProps {
    forms: formItemProps[],
    onRowAction: (id: number, action: string) => void,
    onRemoveSelected: (ids: number[]) => void,
    pagination: paginationProps | null
    onSetPage: (page: number) => void,
    onSetPageSize: (pageSize: number) => void,
    onSetSort: (field: string) => void,
}

export const FormList = ({ 
    forms, 
    pagination,
    onRowAction, 
    onRemoveSelected,  
    onSetPage, 
    onSetPageSize, 
    onSetSort 
}: formListProps) => {
    const [checkedList, setCheckedList] = useState<number[]>([]);

    const handleCheckedItem = (id: number) => {
        setCheckedList(prev => (
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        ))
    }

    const handleCheckedAll = () => {
        // 返回包含所有页面数据 id 的数组
        setCheckedList(prev => (
            prev.length != forms.length
                ? forms.map(item => item.id)
                : []
        ));
    }

    return (
        <>
            <Table className="border">
                <TableHeader>
                    <TableRow>
                        <TableHead></TableHead>
                        <TableHead>标题</TableHead>
                        <TableHead>
                            <Button 
                                variant="outline" 
                                className="border-none" 
                                onClick={() => onSetSort('expired_at')}>
                                过期时间&nbsp;
                                <ChevronsUpDown size="12" />
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button 
                                variant="outline" 
                                className="border-none" 
                                onClick={() => onSetSort('created_at')}>
                                创建时间&nbsp;
                                <ChevronsUpDown size="12" />
                            </Button>
                        </TableHead>
                        <TableHead>数据量</TableHead>
                        <TableHead>操作</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {forms.length ? forms.map((formItem) => (
                        <FormItem key={formItem.id}
                            formItem={formItem}
                            onRowAction={onRowAction}
                            checkedList={checkedList}
                            onCheckedItem={handleCheckedItem} />
                    )
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6}>
                                <p className="text-gray-600 text-center">暂无表单数据</p>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>
                            <Checkbox className="flex items-center"
                                checked={forms.length != 0 && checkedList.length == forms.length}
                                onCheckedChange={handleCheckedAll} />
                        </TableCell>
                        <TableCell colSpan={5}>
                            <div className="flex justify-between">
                                <IsSure 
                                    title="确认删除么？"
                                    description="表单删除之后，随之对应的表单数据会一同删除且无法恢复，再次确认，是否需要删除？"
                                    onConfirm={() => onRemoveSelected(checkedList)} >
                                    <Button 
                                        variant="destructive"
                                        size="sm"
                                        className="flex space-x-1 h-8 text-xs" >
                                        <Trash2 size="12" />
                                        <span>批量删除</span>
                                    </Button>
                                </IsSure>
                            
                                {pagination ? (
                                    <div className="flex justify-end items-center space-x-2">
                                        <PaginationInfo
                                            page={pagination.page}
                                            page_size={pagination.page_size}
                                            total={pagination.total}
                                            onSetPageSize={onSetPageSize} />
                                        <PaginationSimple
                                            page={pagination.page}
                                            total_pages={pagination.total_pages}
                                            onSetPage={onSetPage} />
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </>
    )
}

const TableButtonGroup = () => {
    return (
        <div className="flex items-center justify-end space-x-2">
            <Button variant="outline" size="sm" className="flex items-center space-x-1 h-8 text-xs">
                <CirclePlus size="12" />
                <span>新增</span>
            </Button>
        </div>
    )
}

const Form = () => {
    const [searchInput, setSearchInput] = useState("");
    const [forms, setForms] = useState<formItemProps[]>([]);
    // 分页信息
    const [pagination, setPagination] = useState<paginationProps | null>(null);
    // 排序规则
    const [sort, setSort] = useState({
        field: 'id',
        order: 'desc',
    });
    const [loading, setLoading] = useState(true); // 新增 loading 状态

    const fetchForms = async () => {
        const response = await FormService.getFormList({
            page: pagination?.page || 1,
            page_size: pagination?.page_size || 10,
            sort_field: sort.field,
            sort_order: sort.order,
            search: searchInput
        });
        setForms(response.info?.forms || []);
        setPagination(response.info?.pagination || pagination);
        setLoading(false);
    }

    const handleSetPage = (page: number) => {
        if (pagination && page !== pagination.page) {
            setPagination({
                ...pagination,
                page: page,
            });
        }
    }

    const handleSetPageSize = (pageSize: number) => {
        if (pagination && pageSize !== pagination.page_size) {
            setPagination({
                ...pagination,
                page: 1,
                page_size: pageSize,
            });
        }
    }

    const handleSearchInput = (keyword: string) => {
        setSearchInput(keyword);
        if (pagination) {
            setPagination({
                ...pagination,
                page: 1,
            });
        }
    }

    const handleRowAction = async (id: number, action: string) => {
        setLoading(true);
        switch (action) {
            case `edit`:

                break;

            case `delete`:
                const response = await FormService.removeFormItem(id);
                if (response.code == 200) {
                    const newForms = forms.filter(form => form.id != id);
                    setForms(newForms);
                    toast({
                        title: "提示",
                        description: response.msg,
                    });
                } else {
                    toast({
                        title: "错误",
                        description: response.msg,
                    });
                }
                break;

            default:
                break;
        }
        setLoading(false);
    }

    const handleRemoveSelected = async (ids: number[]) => {
        if (ids.length === 0) {
            toast({
                title: "错误",
                description: '请选择删除项目',
            });
            return false;
        }

        setLoading(true);
        const response = await FormService.removeFormSelected(ids);
        if (response.code == 200) {
            const newForms = forms.filter(form => !ids.includes(form.id));
            setForms(newForms);
            toast({
                title: "提示",
                description: response.msg,
            });
        } else {
            toast({
                title: "错误",
                description: response.msg,
            });
        }
        setLoading(false);
    }

    const handleSetSort = (field: string) => {
        // 重复点击的情况切换排序规则
        const order = field == sort.field
            ? (sort.order === 'desc') 
                ? 'asc' 
                : 'desc'
            : sort.order;
        setSort({
            field: field,
            order: order,
        });
    }

    useEffect(() => {
        fetchForms();
    }, [pagination?.page, pagination?.page_size, searchInput, sort]);

    if (loading) 
        return <Spinner size="large" />; // 在加载数据时显示一个加载指示
    
    return (
        <>
            <Header title="表单" />
            <Card className="py-5 mt-2">
                <CardHeader className="py-2">
                    <div className="flex justify-between">
                        <SearchBar
                            searchInput={searchInput}
                            onSearchInput={handleSearchInput} />
                        <TableButtonGroup />
                    </div>
                </CardHeader>
                <CardContent>
                    <FormList
                        forms={forms}
                        pagination={pagination}
                        onRowAction={handleRowAction}
                        onRemoveSelected={handleRemoveSelected} 
                        onSetPage={handleSetPage}
                        onSetPageSize={handleSetPageSize}
                        onSetSort={handleSetSort} />
                </CardContent>
            </Card>
        </>
    );
}

export default Form;