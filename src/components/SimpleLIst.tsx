import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem,
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { dateFormatter } from "@/utils/dateFormatter";
import { Badge } from "@/components/ui/badge";
import { EllipsisVertical } from "lucide-react";
import { Link } from "react-router-dom";

interface actionItemProps {
    label: string,
    paramName: string,
    onAction: (paramValue: any) => void
}

/**
 * 表格的每一行数据组件
 * @param T 列表数据的类型，确保 T 是一个包含 string 类型键的对象，否则无法直接访问 item[field]
 * @param item 列表的单条数据
 * @param actions 需要加载的操作组
 * @param label 操作名称
 * @param paramName 需要传递进操作函数的参数
 * @param onAction 触发的操作方法
 * @returns 处理好的单元格内容
 */

const SimpleActions = ({ item, actions }: {
    item: any,
    actions: actionItemProps[]
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center">
                <EllipsisVertical size="18" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="py-2">
                {/* 如果存在操作组 */}
                {actions && actions.map((action, key) => (
                    <DropdownMenuItem key={key}>
                        <a onClick={() => action.onAction(item[action.paramName])}>{action.label}</a>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

interface simpleFieldProps {
    label: string,
    name: string,
    type: string,
    // 链接形式
    linkPattern?: string,
    // 内容形式
    valuePattern?: string,
}

/**
 * 表格的每一行数据组件
 * @param T 列表数据的类型，确保 T 是一个包含 string 类型键的对象，否则无法直接访问 item[field]
 * @param item 列表的单条数据
 * @param fields 这条数据要渲染出来的字段
 * @returns 处理好的单元格内容
 */

const SimpleItem = <T extends Record<string, any>> ({ item, fields, actions }: {
    item: T,
    fields: simpleFieldProps[]
    actions?: actionItemProps[] 
}) => { 
    // 根据类型渲染单元格内容
    const itemRender = (field: simpleFieldProps) => {
        
        // 单元格内容
        let fieldValue = '';

        // 根据类型判断渲染
        switch (field.type) {
            case 'text':
                // 文本：直接渲染
                fieldValue = item[field.name];
                break;
            case 'date':
                // 时间：转换时间格式
                fieldValue = dateFormatter(new Date(item[field.name]), 'm-d');
                break;
            default: 
                fieldValue = item[field.name];
                break;
        }

        // 应对部分特殊结构 user.username
        fieldValue = field.name === 'username' && !item[field.name] ? item['user']['username'] : fieldValue;

        // 如果存在单元格内容替换模版
        if (field.valuePattern && fieldValue) {
            // 根据模版结构，对单元格内容进行替换修改
            fieldValue = field.valuePattern.replace('{value}', fieldValue); 
        }

        // 如果存在链接，构建链接后返回
        if (field.linkPattern && item.id) {
            // 根据链接结构，约定以 id 替换
            const url = field.linkPattern.replace('{id}', item.id);
            return (
                <Link to={url} >{fieldValue}</Link>
            )
        }

        return fieldValue;
    }
 
    return (
        <TableRow>
            {fields.map((field, key) => (
                <TableCell key={key} className="min-w-20 lg:min-w-fit px-0 text-sm lg:text-sm">
                    {field.type === 'date' ? (
                        <Badge className="font-mono">{itemRender(field)}</Badge>
                    ) : (
                        <span>{itemRender(field)}</span>
                    )}
                </TableCell>
            ))} 
            {actions && actions.length > 0 && (
                <TableCell>
                    <SimpleActions actions={actions} item={item} />
                </TableCell>
            )}                           
        </TableRow>
    )
}

/**
 * 简单列表组件
 * @description 用于移动端或者狭小空间渲染的列表组件，可控制列表渲染列、单元格格式等
 * @param T 列表数据的属性类型，并且预先继承定义了对象类型避免遍历的时候出错
 * @param list 列表数据
 * @param fields 显示渲染的列表字段
 * @returns 一个处理好的数据表格
 */

const SimpleList = <T extends Record<string, any>> ({ list, fields, actions }: {
    list: T[],
    fields: simpleFieldProps[],
    actions?: actionItemProps[]
}) => {
    return (
        <Table className="mb-3">
            <TableHeader>
                {/* <TableRow>
                    {fields.map((item, key) => (
                        <TableHead key={key} className="min-w-20">
                            {item.label}
                        </TableHead>
                    ))}
                </TableRow> */}
            </TableHeader>
            <TableBody>
                {list.map((item, key) => (
                    <SimpleItem<T> 
                        key={key}
                        item={item} 
                        fields={fields}
                        actions={actions}
                    />
                ))}
            </TableBody>
        </Table> 
    )
}

export default SimpleList;