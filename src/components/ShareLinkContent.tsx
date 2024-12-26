import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { QRCodeCanvas } from "qrcode.react";
import { Copy } from "lucide-react";

/**
 * 链接生成二维码的内容组件
 * @param param url 生成二维码的链接
 * @returns JSX 一个可供复制链接，下方是二维码的内容页面
 */

const ShareLinkContent = ({ url }: { url: string }) => {
    // 复制剪贴板状态
    const [copySuccess, setCopySuccess] = useState(false);

    return (
        <>
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
        </>
    )
}

export default ShareLinkContent;