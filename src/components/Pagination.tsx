import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";


interface paginationInfoProps {
    page: number,
    page_size: number,
    total: number,
    onSetPageSize: (pageSize: number) => void,
}

const PaginationInfo = ({ page, page_size, total, onSetPageSize }: paginationInfoProps) => {
    return (
        <div className="flex items-center text-xs text-gray-500 space-x-1">
            <div className="flex items-center space-x-1 text-xs">
                <span>每页显示</span>
                <Select onValueChange={(value) => onSetPageSize(Number(value))} value={String(page_size)} >
                    <SelectTrigger className="w-16 h-8 text-xs"> 
                        <SelectValue placeholder="数据量" />
                    </SelectTrigger>
                    <SelectContent className="font-mono">
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                </Select>
                <span>条，</span>
            </div>
            {/* <p>当前第 {page} 页，显示 {(page - 1) * page_size + 1} - {total - page * page_size > 0 ? page * page_size : total} 条数据，共 {total} 条数据</p> */}
            <p>当前第 {page} 页，共 {total} 条数据</p>
        </div>   
    );
}

interface paginationComplexProps {
    page: number,
    total_pages: number,
    onSetPage: (page: number) => void,
}

const PaginationComplex = ({ page, total_pages, onSetPage }: paginationComplexProps) => {
    const rows = [];
    // 左右页码数
    const borderPages = 2;
    // 最大显示页码数
    const maxVisiblePages = borderPages * 2 + 1;
    
    if (total_pages <= maxVisiblePages) {
        // 总页数小于最大页码数，直接显示所有页数
        for (let i = 1; i <= total_pages; i++) {
            rows.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        isActive={page === i}
                        onClick={() => onSetPage(i)} >{i}</PaginationLink>
                </PaginationItem>
            );
        }
    } else {
        // 当前页码距离首页超过左页码数，则左边显示省略号
        if (page - 1 - borderPages > 0) {
            rows.push(
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }
        // 计算显示出的页码
        for (let i = Math.max(page - borderPages, 1); i <= Math.min(page + borderPages, total_pages); i++) {
            rows.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        isActive={page === i}
                        onClick={() => onSetPage(i)} >{i}</PaginationLink>
                </PaginationItem>
            );
        }
        // 当前页码距离最后一页超过右页码数，则右边显示省略号
        if (page < total_pages - borderPages) {
            rows.push(
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }
    }

    return (
        <Pagination className="cursor-pointer">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => onSetPage(page - 1)}
                        aria-disabled={page <= 1}
                        className={
                            page <= 1 ? "pointer-events-none opacity-50" : undefined
                        }
                    />
                </PaginationItem>
                {rows}
                <PaginationItem>
                    <PaginationNext
                        onClick={() => onSetPage(page + 1)}
                        aria-disabled={page >= total_pages}
                        className={
                            page >= total_pages ? "pointer-events-none opacity-50" : undefined
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

interface paginationSimpleProps {
    page: number,
    total_pages: number,
    onSetPage: (page: number) => void,
}

const PaginationSimple = ({ page, total_pages, onSetPage }: paginationSimpleProps) => {
    return (
        <div className="flex space-x-1">
            <Button size="icon" variant="outline" className="w-8 h-8" disabled={page == 1} onClick={() => onSetPage(1)}>
                <ChevronFirst className="w-3.5 h-3.5" />
            </Button>
            <Button size="icon" variant="outline" className="w-8 h-8" disabled={page == 1} onClick={() => onSetPage(page - 1)} >
                <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <Button size="icon" variant="outline" className="w-8 h-8" disabled={page == total_pages} onClick={() => onSetPage(page + 1)}>
                <ChevronRight className="w-3.5 h-3.5" />
            </Button>
            <Button size="icon" variant="outline" className="w-8 h-8" disabled={page == total_pages} onClick={() => onSetPage(total_pages)}>
                <ChevronLast className="w-3.5 h-3.5" />
            </Button>
        </div>
    ) 
}

export { PaginationSimple, PaginationComplex, PaginationInfo };