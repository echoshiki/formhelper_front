import useAuthStore from '@/stores/AuthStore';
import { useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

const MessageHandler = () => {
    const { message } = useAuthStore();
    const { toast } = useToast();

    useEffect(() => {
        if (message) {
            toast({
                title: "提示",
                description: message,
            });
        }
    }, [message]);

    return null; // 这个组件不渲染任何 UI
};

export default MessageHandler;
