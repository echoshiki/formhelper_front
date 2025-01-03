import { useState } from "react";
import FormService, { formItemProps } from "@/services/FormService";
import { dateFormatter } from "@/utils/dateFormatter";
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
import { ArrowDownAZIcon, CirclePlus, PencilRuler, Search, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/SearchBar";
import { IsSure } from "@/components/package/IsSure";
import { Link } from "react-router-dom";
import useListManager, { paginationProps } from "@/hooks/useListManager";
import { showToast } from "@/utils/common";
import { SortableTableHead } from "@/components/SortableTableHead";
// 分享链接二维码的按钮组件
import ShareLinkButton from "@/components/ShareLinkButton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import SimpleList from "@/components/SimpleLIst";
import ShareLinkContent from "@/components/ShareLinkContent";
import DialogButton, { dialogStateProps } from "@/components/DialogButton";
import { useNavigate } from 'react-router-dom';
import { getConfig } from "@/config";


/**
 * 操作按钮组件
 * @param formId 表单id 
 * @param onRemoveButton 删除按钮调用函数
 * @returns 单项数据的操作按钮组
 */

const ActionButtonGroup = ({ 
    formId, 
    onRemoveButton,
    getShareLinkUrl
 }: { 
    formId: string,
    onRemoveButton: (id: string[]) => void,
    getShareLinkUrl: (id: string) => string
}) => {
    return (
        <div className="h-full flex space-x-2">
            {/* 分享二维码的按钮 */}
            <ShareLinkButton url={getShareLinkUrl(formId)} />
            {/* 编辑表单的按钮 */}
            <Link to={`/edit/form_id/${formId}`} className="cursor-pointer flex items-center">
                <PencilRuler className="w-3.5 h-3.5 cursor-pointer" />
            </Link>
            {/* 删除表单的按钮 */}
            <IsSure 
                title="确认删除么？"
                description="表单删除之后，随之对应的表单数据会一同删除且无法恢复，再次确认，是否需要删除？"
                onConfirm={() => onRemoveButton([formId])}>
                <Trash2 className="w-3.5 h-3.5 cursor-pointer" />
            </IsSure>
        </div>
    )
}

/**
 * 列表单项组件
 * @param formItem 表单遍历的单项数据
 * @param checkedList 选中的表单项 id 集
 * @param onCheckedItem 单选框调用函数
 * @param onRemoveButton 删除按钮调用函数
 * @returns 包含单项数据以及操作按钮的单项组件
 */

const FormItem = ({ 
    formItem, 
    checkedList, 
    onCheckedItem, 
    onRemoveButton, 
    getShareLinkUrl 
}: {
    formItem: formItemProps,
    checkedList: string[],
    onCheckedItem: (id: string) => void,
    onRemoveButton: (id: string[]) => void,
    getShareLinkUrl: (id: string) => string
}) => {
    return (
        <TableRow>
            <TableCell>
                <Checkbox className="flex items-center"
                    checked={checkedList.includes(formItem.id)}
                    onCheckedChange={() => onCheckedItem(formItem.id)} />
            </TableCell>
            <TableCell>
                <Link to={`/submissions/form_id/${formItem.id}`} className="cursor-pointer flex items-center">
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
                </Link>
            </TableCell>
            <TableCell>
                <Badge variant="secondary" className="font-mono">{dateFormatter(new Date(formItem.started_at))}</Badge>
            </TableCell>
            <TableCell>
                <Badge variant="secondary" className="font-mono">{formItem.expired_at ? dateFormatter(new Date(formItem.expired_at)) : "无限期"}</Badge>
            </TableCell>
            <TableCell>
                <Link to={`/submissions/form_id/${formItem.id}`} className="cursor-pointer flex items-center font-mono">
                    <Search className="w-3.5 h-3.5 mr-1" />
                    {formItem.submissions_count}
                </Link>
            </TableCell>
            <TableCell className="text-right">
                {/* 操作按钮组 */}
                <ActionButtonGroup 
                    formId={formItem.id}
                    onRemoveButton={onRemoveButton}
                    getShareLinkUrl={getShareLinkUrl}
                />
            </TableCell>
        </TableRow>
    );
}

/**
 * 列表单项组件
 * @param formItem 表单遍历的单项数据
 * @param checkedList 选中的表单项 id 集
 * @param onCheckedItem 单选框调用函数
 * @param onRemoveButton 删除按钮调用函数
 * @returns 包含单项数据以及操作按钮的单项组件
 */

interface formListProps {
    displayFields: displayFieldProps[],
    forms: formItemProps[],
    onRemoveSelected: (ids: string[]) => void,
    pagination: paginationProps,
    onSetPage: (page: number) => void,
    onSetPageSize: (pageSize: number) => void,
    onSetSort: (field: string) => void,
}

export const FormList = ({ 
    displayFields,
    forms, 
    pagination,
    onRemoveSelected,  
    onSetPage, 
    onSetPageSize, 
    onSetSort 
}: formListProps) => {
    
    // 复选框的状态
    const [checkedList, setCheckedList] = useState<string[]>([]);

    // 处理单选
    const handleCheckedItem = (id: string) => {
        setCheckedList(prev => (
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        ))
    }

    // 组合分享链接
    const getShareLinkUrl = ( id: string ) => {
        return `${window.location.protocol}//${window.location.hostname}${window.location.port && `:${window.location.port}`}${getConfig().VITE_APP_PREFIX}/v/${id}`;
    } 

    // 处理全选
    const handleCheckedAll = () => {
        // 返回包含所有页面数据 id 的数组
        setCheckedList(prev => (
            prev.length != forms.length
                ? forms.map(item => item.id)
                : []
        ));
    }

    const navigate = useNavigate();
    
    // 移动端表格列表渲染结构
    const simpleFormFields = [
        { label: '日期', name: 'created_at', type: 'date' },
        { label: '数据', name: 'title', type: 'text', linkPattern: 'submissions/form_id/{id}'},
    ];

    // 移动端操作组
    const simpleFormActions = [
        { label: '编辑', paramName: 'id', onAction: (id: string) => navigate(`/edit/form_id/${id}`) },
        { label: '删除', paramName: 'id', onAction: (id: string) => confirm('确认删除么？') && onRemoveSelected([id])},
        { label: '分享', paramName: 'id', onAction: (id: string) => handleShareLink(id) }
    ];

    // 弹窗信息状态管理
    const [shareDialogState, setShareDialogState] = useState<dialogStateProps>({
        label: '分享表单',
        title: '分享表单',
        description: '将表单链接分享到社区、聊天群或者你想的任何人！',
        content: null,
        isOpen: false
    });

    const handleShareLink = (id: string) => {
        setShareDialogState({
            ...shareDialogState,
            isOpen: true,
            content: (<ShareLinkContent url={getShareLinkUrl(id)} />)
        });
        // 清除遮罩
        document.body.style.pointerEvents = "";
    }

    return (
        <>
            {/* 移动端渲染列表 */}
            <div className="lg:hidden">
                {/* 移动端简洁列表 */}
                <SimpleList<formItemProps> 
                    list={forms} 
                    fields={simpleFormFields} 
                    actions={simpleFormActions}
                />
                {/* 移动端简洁分页 */}
                <PaginationSimple
                    page={pagination.page}
                    total_pages={pagination.total_pages || 0}
                    onSetPage={onSetPage} 
                />
                {/* 分享二维码 */}
                <DialogButton 
                    dialogState={shareDialogState} 
                    setDialogState={setShareDialogState} 
                />
            </div>

            <Table className="border hidden lg:table">
                <TableHeader>
                    <TableRow>
                        <TableHead></TableHead>
                        {/* 只遍历字段的渲染，并不关联列表值 */}
                        {displayFields.filter(item => item.display).map((item, key) => item.sort ? (
                            <SortableTableHead 
                                key={key}
                                title={item.label}
                                field={item.field}
                                onSetSort={onSetSort} />
                        ) : (
                            <TableHead key={key} className={`w-${item.width}`}>{item.label}</TableHead>
                        ))}
                        <TableHead>操作</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {forms.length ? forms.map((formItem) => (
                        <FormItem key={formItem.id}
                            formItem={formItem}
                            checkedList={checkedList}
                            onCheckedItem={handleCheckedItem}
                            onRemoveButton={onRemoveSelected}
                            getShareLinkUrl={getShareLinkUrl}
                        />
                    )) : (
                        <TableRow>
                            <TableCell colSpan={5}>
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

/**
 * 列表上方按钮组件
 * @returns 包含列表上方的工具栏按钮
 */

const TableButtonGroup = ({ displayFields, onSetSort }: {
    displayFields: displayFieldProps[],
    onSetSort: (field: string) => void,
}) => {
    return (
        <div className="hidden lg:flex items-center justify-end space-x-2">
            <Link to="/create">
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center space-x-1 h-8 text-xs"
                >
                    <CirclePlus size="12" />
                    <span>新增</span>
                </Button>
            </Link>

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="outline" size="sm" className="flex items-center space-x-1 h-8 text-xs">
                        <ArrowDownAZIcon size="12" />
                        <span>排序</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="py-2">
                    {displayFields.filter(item => item.sort).map((item, key) => (
                        <DropdownMenuItem key={key}>
                            <a href="#" onClick={() => onSetSort(item.field)}>{item.label}</a>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu> 
        </div>
    )
}

// 列表字段渲染属性
interface displayFieldProps {
    field: string,
    label: string,
    display: boolean,
    sort: boolean,
    width?: number 
}

/**
 * 表单列表组件
 * @description 
 * 通过自定义 Hook `useListManager` 管理表单列表相关的状态和逻辑，包括：
 * - 列表数据 `forms` 和更新函数 `setForms`
 * - 分页相关信息和处理函数 `pagination`, `handleSetPage`, `handleSetPageSize`
 * - 排序逻辑 `handleSetSort`
 * - 搜索功能 `handleSearchButton`
 * - 加载状态 `loading`
 * `useListManager` 提供的这些参数和函数，简化了列表的管理逻辑。
 * @returns 表单列表组件
 */

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

    // 列表渲染的字段，不关联列表值
    const displayFields: displayFieldProps[] = [
        { field: 'title', label: '标题', display: true, sort: false, width: 96 },
        { field: 'created_at', label: '创建时间', display: false, sort: true },
        { field: 'started_at', label: '开始时间', display: true, sort: true },
        { field: 'expired_at', label: '过期时间', display: true, sort: true }, 
        { field: 'submissions_count', label: '数据', display: true, sort: true }
    ];

    const handleRemoveSelected = async (ids: string[]) => {
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
                <Card className="w-full py-5 mt-2">
                    <CardHeader className="py-2">
                        <div className="flex flex-wrap direction-reverse lg:direction-normal space-y-2 lg:space-y-0 lg:justify-between lg:pb-0">
                            <SearchBar onSearchButton={handleSearchButton} />
                            <TableButtonGroup 
                                displayFields={displayFields} 
                                onSetSort={handleSetSort}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <FormList
                            displayFields={displayFields}
                            forms={forms}
                            // 分页 UI
                            pagination={pagination}
                            // 删除选择项
                            onRemoveSelected={handleRemoveSelected} 
                            // 跳转页码
                            onSetPage={handleSetPage}
                            // 设置显示条数
                            onSetPageSize={handleSetPageSize}
                            // 处理排序
                            onSetSort={handleSetSort} 
                        />
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