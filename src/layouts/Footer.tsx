import { Card } from "@/components/ui/card"

export default function Footer() {
    return (
        <Card className="w-full px-5 py-6 mt-2">
            <div className="flex justify-between items-center text-xs text-gray-500">
                <p>Copyright © 2024 自定义表单平台</p>
                <p>技术支持：Shiki ｜ 架构：React + Tailwindcss + Shadcn</p>
            </div>
        </Card>
    )
}
