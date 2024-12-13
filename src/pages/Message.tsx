import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileX2 } from "lucide-react";

const NotFound = () => {
    return (
        <Card className="w-72 md:w-auto mx-auto px-10 py-20 h-full flex items-center">
            <div className="text-left">
                <p className="text-lg flex items-center space-x-2">
                    <FileX2 size="20" />
                    <p>404 Page</p>
                </p>
                <h1 className="text-5xl font-extrabold mt-2">Page Not Found</h1>
                <p className="text-lg font-light mt-5">对不起，你所访问的页面似乎没有找到。</p>
                <div className="flex space-x-2 mt-10">
                    <Button>返回首页</Button>
                    <Button variant={`outline`}>个人中心</Button>
                </div>
            </div>
        </Card>
    )
}

export default NotFound;