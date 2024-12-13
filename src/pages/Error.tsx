import LandingPage from "@/components/LandingPage"

const Error = () => {
    return (
        <LandingPage 
            coverPhoto="error" 
            title="页面出错" 
            description="访问的表单已经过期或者设置成禁止访问" />
    )
}

export default Error;