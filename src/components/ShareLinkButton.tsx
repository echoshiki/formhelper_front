import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScanQrCode } from "lucide-react";
import ShareLinkContent from "./ShareLinkContent";

/**
 * 二维码分享按钮组件
 * @param formId 表单id 
 * @returns 一个分享二维码的按钮
 */

const ShareLinkButton = ({ url }: { url: string }) => {
    // 返回一个分享二维码的按钮
    return (
        <Dialog>
            <DialogTrigger asChild>
                <ScanQrCode className="w-3.5 h-3.5 cursor-pointer" />
            </DialogTrigger> 
            <DialogContent className="max-w-xs sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>分享</DialogTitle>
                    <DialogDescription>
                        将表单链接分享到社区、聊天群或者你想的任何人！
                    </DialogDescription>
                </DialogHeader>
                <ShareLinkContent url={url} />
            </DialogContent>
        </Dialog>
    )
}

export default ShareLinkButton;