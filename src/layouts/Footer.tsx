import { Card } from "@/components/ui/card"

export default function Footer() {
    return (
        <Card className="w-full px-5 py-6 mt-2">
            <div className="lg:flex lg:justify-between items-center text-xs text-gray-500">
                <p className="mb-1 lg:mb-0">Copyright © 2024 自定义表单平台</p>
                <p>技术支持：Shiki</p>
            </div>
        </Card>
    )
}
