import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { QRCodeCanvas } from "qrcode.react";
import { Copy, ScanQrCode } from "lucide-react";

/**
 * 二维码分享按钮组件
 * @param formId 表单id 
 * @returns 一个分享二维码的按钮
 */

const ShareLinkButton = ({ url }: { url: string }) => {
    // 复制剪贴板状态
    const [copySuccess, setCopySuccess] = useState(false);
    // 返回一个分享二维码的按钮
    return (
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
                            defaultValue={url}
                            readOnly
                        />
                    </div>
                    <CopyToClipboard 
                        text={url}
                        onCopy={() => setCopySuccess(true)}
                    >
                        <Button size="sm" className="px-3">
                            {copySuccess ? <span>已复制</span> : (
                                <>
                                    <span className="sr-only">复制</span>
                                    <Copy />
                                </>
                            )}  
                        </Button>
                    </CopyToClipboard>
                </div>
                <div className="flex justify-center py-5">
                    <QRCodeCanvas 
                        value={url}                 // 必填：二维码内容
                        size={210}                  // 尺寸（默认 128）
                        bgColor="#ffffff"           // 背景色
                        fgColor="#000000"           // 前景色
                        level="H"                   // 容错等级（L, M, Q, H）
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ShareLinkButton;