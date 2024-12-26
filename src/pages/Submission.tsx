import { useState } from "react";
import Header from "@/layouts/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SubmissionService, { submissionItemProps } from "@/services/SubmissionService";
import useListManager, { paginationProps } from "@/hooks/useListManager";
import { SortableTableHead } from "@/components/SortableTableHead";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { dateFormatter } from "@/utils/dateFormatter";
import { IsSure } from "@/components/package/IsSure";
import { Trash2, Eye } from "lucide-react";
import { PaginationInfo, PaginationSimple } from "@/components/Pagination";
import { showToast } from "@/utils/common";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Spinner } from "@/components/package/Spinner";
import SimpleList from "@/components/SimpleLIst";

interface submissionListProps {
    items: submissionItemProps[],
    onRemoveSelected: (ids: string[]) => void,
    pagination: paginationProps,
    onSetPage: (page: number) => void,
    onSetPageSize: (pageSize: number) => void,
    onSetSort: (field: string) => void,
}

const SubmissionList = ({
    items: submissions,
    pagination,
    onRemoveSelected,
    onSetPage,
    onSetPageSize,
    onSetSort
}: submissionListProps) => {
    const [checkedList, setCheckedList] = useState<string[]>([]);
    const handleCheckedItem = (id: string) => {
        setCheckedList(prev => (
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        ))
    }
    const handleCheckedAll = () => {
        // 返回包含所有页面数据 id 的数组
        setCheckedList(prev => (
            prev.length != submissions.length
                ? submissions.map(item => item.id)
                : []
        ));
    }

    const navigate = useNavigate();

    const simpleSubmissionFields = [
        { label: '日期', name: 'submitted_at', type: 'date' },
        { label: '数据', name: 'username', type: 'text', linkPattern: '/submissions/{id}', valuePattern: '用户 [{value}] 提交了表单'},
    ];

    const simpleSubmissionActions = [
        { label: '查看', paramName: 'id', onAction: (id: string) => navigate(`/submissions/${id}`)},
        { label: '删除', paramName: 'id', onAction: (id: string) => confirm('确认要删除么？') && onRemoveSelected([id]) }
    ];

    return (
        <>
            {/* 移动端渲染 */}
            <div className="lg:hidden">
                <SimpleList
                    list={submissions}
                    fields={simpleSubmissionFields}
                    actions={simpleSubmissionActions}
                />
                <PaginationSimple
                    page={pagination.page}
                    total_pages={pagination.total_pages || 0}
                    onSetPage={onSetPage} 
                />
            </div>

            <Table className="border hidden lg:table">
                <TableHeader>
                    <TableRow>
                        <TableHead></TableHead>
                        <TableHead>数据</TableHead>
                        <TableHead>所属表单</TableHead>
                        <SortableTableHead
                            title="提交时间"
                            field="submitted_at"
                            onSetSort={onSetSort} />
                        <TableHead>操作</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {submissions.length ? submissions.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <Checkbox className="flex items-center"
                                    checked={checkedList.includes(item.id)}
                                    onCheckedChange={() => handleCheckedItem(item.id)} />
                            </TableCell>
                            <TableCell>
                                用户 [{item.user.username}] 提交的数据
                            </TableCell>
                            <TableCell>
                                {item.form.title}
                            </TableCell>
                            <TableCell className="font-mono">
                                <Badge>{dateFormatter(new Date(item.submitted_at))}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="h-full flex space-x-2">
                                    <Link to={`/submissions/${item.id}`} className="cursor-pointer flex items-center">
                                        <Eye className="w-3.5 h-3.5 cursor-pointer" />
                                    </Link>
                                    <IsSure
                                        title="确认删除么？"
                                        description="表单删除之后，随之对应的表单数据会一同删除且无法恢复，再次确认，是否需要删除？"
                                        onConfirm={() => onRemoveSelected([item.id])}>
                                        <Trash2 className="w-3.5 h-3.5 cursor-pointer" />
                                    </IsSure>
                                </div>
                            </TableCell>
                        </TableRow>
                    )
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6}>
                                <p className="text-gray-600 text-center">暂无数据</p>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>
                            <Checkbox className="flex items-center"
                                checked={submissions.length != 0 && checkedList.length == submissions.length}
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
    );
}

const Submission = () => {

    const { form_id } = useParams();
    const {
        items,
        setItems,
        pagination,
        loading,
        handleSetPage,
        handleSetPageSize,
        handleSetSort
    } = useListManager<submissionItemProps>(SubmissionService.getSubmissionList, { form_id: form_id });
    
    const handleRemoveSelected = async (ids: string[]) => {
        if (ids.length === 0) {
            showToast('请选择需要删除的项目。', 2);
            return false;
        }
        const response = await SubmissionService.removeSubmissionSelected(ids);
        if (response.code == 200) {
            setItems(prevItems => prevItems.filter(item => !ids.includes(item.id)));
            showToast(response.msg);
        } else {
            showToast(response.msg, 2);
        }
    }

    return (
        <>
            {!loading ? (
                <>
                <Header title="数据" />
                <Card className="w-full py-5 mt-2">
                    <CardContent>
                        <SubmissionList
                            items={items}
                            pagination={pagination}
                            onSetPage={handleSetPage}
                            onSetPageSize={handleSetPageSize}
                            onSetSort={handleSetSort}
                            onRemoveSelected={handleRemoveSelected} />
                    </CardContent>
                </Card>
                </>
            ) : (
                <Spinner size="large" />
            )}  
        </>
    );
}

export default Submission;
