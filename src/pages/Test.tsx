import React from 'react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable as Droppable } from '@/components/StrictModeDroppable'

// 示例字段数据
const initialFields = [
    { id: '1', label: '姓名' },
    { id: '2', label: '年龄' },
    { id: '3', label: '手机号码' },
];

const DraggableFields = () => {
    const [formFields, setFormFields] = React.useState(initialFields);

    // 处理拖拽完成事件
    const handleDragEnd = (result: any) => {
        // 解构出原位置与目标位置的对象（index）
        const { source, destination } = result;

        // 如果没有目标位置，直接返回
        if (!destination) return;

        // 通过将原位置（source）删除的数组元素插入到目标位置（destination）组成新的数组来实现重新排序字段
        // 因为需要改变数组，所以创建一个状态量 formFields 的副本
        const reorderedFields = Array.from(formFields);
        // splice() 方法删除数组的元素，source.index 开始，1 为删除个数
        // 返回被删除的元素数组（可能为多个）
        // 数组解构，将剔除的元素返回赋值给 movedField
        const [movedField] = reorderedFields.splice(source.index, 1);
        // 向指定索引的地方插入元素（moveField），0 表示不删除任何元素
        reorderedFields.splice(destination.index, 0, movedField);

        // 更新原数组状态量
        setFormFields(reorderedFields);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="f1">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                    >
                        {formFields.map((field, index) => (
                            <Draggable key={field.id} draggableId={field.label} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="flex items-center space-x-4 p-2 bg-gray-100 border rounded"
                                    >
                                        <span className="font-medium">{field.label}</span>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default DraggableFields;
