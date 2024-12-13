import { Card } from "@/components/ui/card";

const NotFound = () => {
    return (
        <Card className="w-72 md:w-full mx-auto px-10 py-20 h-full flex items-center justify-center ">
            <div className="h-full flex items-center space-x-2">
                <span className="text-2xl font-semibold border-r border-gray-400 pr-6 leading-10">404</span>
                <span className="text-sm font-light px-3 text-gray-500">当前访问的页面无法找到</span>
            </div>
        </Card>
    )
}

export default NotFound;