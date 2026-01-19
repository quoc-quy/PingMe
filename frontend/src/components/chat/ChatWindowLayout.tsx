import { useChatStore } from "@/stores/useChatStore";
import React, { useEffect } from "react";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import ChatWindowSkeleton from "./ChatWindowSkeleton";
import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";
import ChatWindowBody from "./ChatWindowBody";
import MessageInput from "./MessageInput";

const ChatWindowLayout = () => {
    const {
        activeConversationId,
        conversations,
        messageLoading: loading,
        messages,
        markAsSeen,
    } = useChatStore();

    const selectConvo = conversations.find((c) => c._id === activeConversationId) ?? null;

    useEffect(() => {
        if (!selectConvo) return;

        const markSeen = async () => {
            try {
                await markAsSeen();
            } catch (error) {
                console.error("Lỗi khi markSeen", error);
            }
        };

        markAsSeen();
    }, [markAsSeen, selectConvo]);

    if (!selectConvo) {
        return <ChatWelcomeScreen />;
    }

    if (loading) {
        return <ChatWindowSkeleton />;
    }

    return (
        <SidebarInset className="flex flex-col h-full overflow-hidden rounded-sm shadow-sm">
            {/* Header */}
            <ChatWindowHeader chat={selectConvo} />

            {/* Body */}
            <div className="flex-1 overflow-y-auto bg-primary-foreground">
                <ChatWindowBody />
            </div>

            {/* Footer */}
            <MessageInput selectedConvo={selectConvo} />
        </SidebarInset>
    );
};

export default ChatWindowLayout;
