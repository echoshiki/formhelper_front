import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export interface dialogStateProps {
    label: string,
    title: string,
    description: string,
    content: any,
    isOpen: boolean,
}

interface dialogButtonProps {
    dialogState: dialogStateProps,
    setDialogState: (dialogState: dialogStateProps) => void,
}

/**
 * 受控模式下弹窗封装组件
 * @param dialogState 传入的弹窗信息状态组
 * @param label 触发弹窗的标签
 * @param title 弹窗标题
 * @param description 弹窗描述
 * @param content 弹窗的内容
 * @param isOpen 弹窗闭合状态
 * @param setDialogState 状态更新方法
 * @returns 
 */

const DialogButton = ({ dialogState, setDialogState }: dialogButtonProps) => {
    return (
        <Dialog 
            // 在受控模式下开闭状态由控制方传递
            open={dialogState.isOpen} 
            // 在受控模式下将内部状态传递回控制方，比如点击关闭的状态
            onOpenChange={isOpen => setDialogState({...dialogState, isOpen})}
        >
            <DialogTrigger asChild>
                {dialogState.label}
            </DialogTrigger> 
            <DialogContent className="max-w-xs">
                <DialogHeader>
                    <DialogTitle>{dialogState.title}</DialogTitle>
                    <DialogDescription>
                       {dialogState.description}
                    </DialogDescription>
                </DialogHeader>
                {dialogState.content}
            </DialogContent>
        </Dialog>
    )
}

export default DialogButton;