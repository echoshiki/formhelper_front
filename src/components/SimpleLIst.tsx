import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { dateFormatter } from "@/utils/dateFormatter"

interface simpleFieldProps {
    label: string,
    name: string,
    type: string,
    // 链接形式
    linkPattern?: string,
}

/**
 * 表格的每一行数据组件
 * @param T 列表数据的类型，确保 T 是一个包含 string 类型键的对象，否则无法直接访问 item[field]
 * @param item 列表的单条数据
 * @param fields 这条数据要渲染出来的字段
 * @returns 处理好的单元格内容
 */

const SimpleItem = <T extends Record<string, any>> ({ item, fields }: {
    item: T,
    fields: simpleFieldProps[]
}) => { 
    const itemRender = (field: simpleFieldProps) => {
        let fieldValue = '';

        switch (field.type) {
            case 'text':
                fieldValue = item[field.name];
                break;
            case 'date':
                fieldValue = dateFormatter(new Date(item[field.name]), 'm-d');
                break;
            default: 
                fieldValue = item[field.name];
                break;
        }

        // 如果存在链接，构建链接后返回
        if (field.linkPattern && item.id) {
            const url = field.linkPattern.replace('{id}', item.id);
            return (
                <a href={url} >{fieldValue}</a>
            )
        }

        return fieldValue;
    }
 
    return (
        <TableRow>
            {fields.map((field, key) => (
                <TableCell key={key} className="px-0 text-sm lg:text-sm">
                    {itemRender(field)}
                </TableCell>
            ))}                             
        </TableRow>
    )
}

/**
 * 用于移动端的简单列表
 * @param T 列表数据的属性类型，并且定义了对象类型避免遍历的时候出错
 * @param list 列表数据
 * @param fields 显示渲染的列表字段
 * @returns 一个处理好的数据表格
 */

const SimpleList = <T extends Record<string, any>> ({ list, fields }: {
    list: T[],
    fields: simpleFieldProps[]
}) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {fields.map((item, key) => (
                        <TableHead key={key}>
                            {item.label}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {list.map((item, key) => (
                    <SimpleItem<T> 
                        key={key}
                        item={item} 
                        fields={fields} 
                    />
                ))}
            </TableBody>
        </Table> 
    )
}

export default SimpleList;