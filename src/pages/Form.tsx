import { useState } from "react";
import FormService, { formItemProps } from "@/services/FormService";
import { dateFormatter } from "@/utils/dateFormatter";
import { QRCodeCanvas } from 'qrcode.react';
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
import { CirclePlus, Copy, PencilRuler, ScanQrCode, Search, Trash2, UserCircleIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/SearchBar";
import { IsSure } from "@/components/package/IsSure";
import { Link } from "react-router-dom";
import useListManager, { paginationProps } from "@/hooks/useListManager";
import { showToast } from "@/utils/common";
import { SortableTableHead } from "@/components/SortableTableHead";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import config from '@/config';

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
            <TableCell className="w-60">
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
                <Badge variant="secondary">{dateFormatter(new Date(formItem.started_at))}</Badge>
            </TableCell>
            <TableCell className="font-mono">
                {formItem.expired_at ? (
                    <Badge variant={`${new Date(formItem.expired_at) < new Date() ? "destructive" : "secondary" }`} >{dateFormatter(new Date(formItem.expired_at))}</Badge>
                ) : (
                    <Badge variant="secondary" >无限期</Badge>
                )}
            </TableCell>
            <TableCell>
                <div className="cursor-pointer flex items-center">
                    <UserCircleIcon className="w-3.5 h-3.5 mr-1" />
                    {formItem.limited}
                </div>
            </TableCell>
            <TableCell>
                <Link to={`/submissions/form_id/${formItem.id}`} className="cursor-pointer flex items-center">
                    <Search className="w-3.5 h-3.5 mr-1" />
                    {formItem.submissions_count}
                </Link>
            </TableCell>
            <TableCell className="text-right">
                <div className="h-full flex space-x-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <ScanQrCode className="w-3.5 h-3.5 cursor-pointer" />
                        </DialogTrigger> 
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>分享</DialogTitle>
                                <DialogDescription>
                                    将表单链接分享到社区、聊天群或者你想的任何人！
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="link" className="sr-only">
                                    链接
                                    </Label>
                                    <Input
                                        id="link"
                                        defaultValue={`${config.APP_BASE_URL}/v/${formItem.id}`}
                                        readOnly
                                    />
                                </div>
                                <Button type="submit" size="sm" className="px-3">
                                    <span className="sr-only">复制</span>
                                    <Copy />
                                </Button>
                            </div>
                            <div className="flex justify-center py-5">
                                <QRCodeCanvas 
                                    value={`${config.APP_BASE_URL}/v/${formItem.id}`} // 必填：二维码内容
                                    size={210}                  // 尺寸（默认 128）
                                    bgColor="#ffffff"           // 背景色
                                    fgColor="#000000"           // 前景色
                                    level="H"                   // 容错等级（L, M, Q, H）
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Link to={`/edit/form_id/${formItem.id}`} className="cursor-pointer flex items-center">
                        <PencilRuler className="w-3.5 h-3.5 cursor-pointer" />
                    </Link>
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
                            title="开始时间"
                            field="started_at"
                            onSetSort={onSetSort} />
                        <SortableTableHead 
                            title="过期时间"
                            field="expired_at"
                            onSetSort={onSetSort} />
                        <TableHead>限制数</TableHead>
                        <TableHead>填报量</TableHead>
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
                        <TableCell colSpan={6}>
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
            <Link to="/create">
                <Button variant="outline" size="sm" className="flex items-center space-x-1 h-8 text-xs">
                    <CirclePlus size="12" />
                    <span>新增</span>
                </Button>
            </Link>
        </div>
    )
}

const Form = () => { 
    // 列表相关逻辑方法封装进 Hook 内
    // 传入数据接口服务
    // 解构出所需的数据与函数
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