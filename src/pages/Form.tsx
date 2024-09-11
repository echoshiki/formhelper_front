import { useState } from "react";
import FormService, { formItemProps } from "@/services/FormService";
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
import { CirclePlus, PencilRuler, Search, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/SearchBar";
import { IsSure } from "@/components/package/IsSure";
import { Link } from "react-router-dom";
import useListManager, { paginationProps } from "@/hooks/useListManager";
import { showToast } from "@/utils/common";
import { SortableTableHead } from "@/components/SortableTableHead";

const FormItem = ({ formItem, checkedList, onCheckedItem, onRemoveButton }: {
    formItem: formItemProps,
    checkedList: number[],
    onCheckedItem: (id: number) => void,
    onRemoveButton: (id: number[]) => void,
}) => {
    return (
        <TableRow>
            <TableCell>
                <Checkbox className="flex items-center"
                    checked={checkedList.includes(formItem.id)}
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
                <Link to={`/submissions/form_id/${formItem.id}`} className="cursor-pointer flex items-center">
                    <Search className="w-3.5 h-3.5 mr-1" />
                    {formItem.submissions_count}
                </Link>
            </TableCell>
            <TableCell className="text-right">
                <div className="h-full flex space-x-2">
                    <PencilRuler className="w-3.5 h-3.5 cursor-pointer" />
                    <IsSure 
                        title="确认删除么？"
                        description="表单删除之后，随之对应的表单数据会一同删除且无法恢复，再次确认，是否需要删除？"
                        onConfirm={() => onRemoveButton([formItem.id])}>
                        <Trash2 className="w-3.5 h-3.5 cursor-pointer" />
                    </IsSure>
                </div>
            </TableCell>
        </TableRow>
    );
}

interface formListProps {
    forms: formItemProps[],
    onRemoveSelected: (ids: number[]) => void,
    pagination: paginationProps,
    onSetPage: (page: number) => void,
    onSetPageSize: (pageSize: number) => void,
    onSetSort: (field: string) => void,
}

export const FormList = ({ 
    forms, 
    pagination,
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
                        <SortableTableHead 
                            title="过期时间"
                            field="expired_at"
                            onSetSort={onSetSort} />
                       <SortableTableHead 
                            title="创建时间"
                            field="created_at"
                            onSetSort={onSetSort} />
                        <TableHead>数据量</TableHead>
                        <TableHead>操作</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {forms.length ? forms.map((formItem) => (
                        <FormItem key={formItem.id}
                            formItem={formItem}
                            checkedList={checkedList}
                            onCheckedItem={handleCheckedItem}
                            onRemoveButton={onRemoveSelected} />
                    )) : (
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
                                            total={pagination.total || 0}
                                            onSetPageSize={onSetPageSize} />
                                        <PaginationSimple
                                            page={pagination.page}
                                            total_pages={pagination.total_pages || 0}
                                            onSetPage={onSetPage} />
                                    </div>
                                ) : (
                                    null
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
    // 列表相关逻辑方法封装进 Hook 内
    const {
        items: forms,
        setItems: setForms,
        pagination,
        loading,
        handleSearchButton,
        handleSetPage,
        handleSetPageSize,
        handleSetSort
    } = useListManager<formItemProps>(FormService.getFormList);

    const handleRemoveSelected = async (ids: number[]) => {
        if (ids.length === 0) {
            showToast('请选择需要删除的项目。', 2);
            return false;
        }
        const response = await FormService.removeFormSelected(ids);
        if (response.code == 200) {
            setForms(prevForms => prevForms.filter(form => !ids.includes(form.id)));
            showToast(response.msg);
        } else {
            showToast(response.msg, 2);
        }
    }

    return (
        <>
            {!loading ? (
                <>
                <Header title="表单" />
                <Card className="py-5 mt-2">
                    <CardHeader className="py-2">
                        <div className="flex justify-between">
                            <SearchBar onSearchButton={handleSearchButton} />
                            <TableButtonGroup />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <FormList
                            forms={forms}
                            pagination={pagination}
                            onRemoveSelected={handleRemoveSelected} 
                            onSetPage={handleSetPage}
                            onSetPageSize={handleSetPageSize}
                            onSetSort={handleSetSort} />
                    </CardContent>
                </Card>
                </>
            ) : (
                <Spinner size="large" />
            )}
        </> 
    );
}

export default Form;