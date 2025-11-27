import Logout from "@/components/auth/Logout";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import React, { use } from "react";
import { toast } from "sonner";

const ChatAppPage = () => {
    const user = useAuthStore((s) => s.user);

    const handleOnclick = async () => {
        try {
            await api.get("/users/test", { withCredentials: true });
            toast.success("Ok");
        } catch (error) {
            console.error(error);
            toast.error("not ok");
        }
    };
    return (
        <div>
            {user?.username}
            <Logout />

            <Button onClick={handleOnclick}>test</Button>
        </div>
    );
};

export default ChatAppPage;
