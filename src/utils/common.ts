import { toast } from "@/components/ui/use-toast";

const showToast = (message: string, type: 1 | 2 = 1) => {
    toast({
        title: type === 1 ? "提示" : "错误",
        description: message,
    });
}

export {
    showToast
}
