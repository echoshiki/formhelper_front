import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";

interface landingPageProps {
    coverPhoto: string,
    title: string,
    description: string,
    buttonTitle: string,
    buttonLink: string,
}

const LandingPage = ({ 
    coverPhoto = "message", 
    title = "提示信息", 
    description, 
    buttonTitle = "返回首页", 
    buttonLink = "/" 
}: Partial<landingPageProps>) => {
    const navigate = useNavigate();
    // svg 资源动态路径获取
    const getSvgPath = (filename: string) => {
        return new URL(`../assets/${filename}.svg`, import.meta.url).href;
    }
    return (
        <Card className="w-full md:w-full mx-auto px-10 py-20 h-full flex items-center">
            <div className="text-center w-full">
                <div className="flex justify-center mb-10">
                    <img src={getSvgPath(coverPhoto)} className="w-52" />
                </div>
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="mt-2 text-sm font-light leading-loose text-gray-500 whitespace-pre-line">{description}</p>
                <Button size="lg" className="mt-10" onClick={() => navigate(buttonLink)}>{buttonTitle}</Button>
            </div>
        </Card> 
    )
}

export default LandingPage;