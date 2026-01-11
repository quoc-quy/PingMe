import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";
import UserAvatar from "./UserAvatar";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface MessageItemProps {
    message: Message;
    index: number;
    messages: Message[];
    selectedConvo: Conversation;
    lastMessageStatus: "delivered" | "seen";
}

const MessageItem = ({
    message,
    index,
    messages,
    selectedConvo,
    lastMessageStatus,
}: MessageItemProps) => {
    const prev = messages[index - 1];

    const isGroupBreak =
        index === 0 ||
        prev?.senderId !== message.senderId ||
        new Date(message.createdAt).getTime() - new Date(prev?.createdAt || 0).getTime() > 300000; // 5 minutes

    const participant = selectedConvo.participants.find(
        (p: Participant) => p._id === message.senderId
    );

    return (
        <div
            className={cn(
                "flex gap-2 message-bounce",
                message.isOwn ? "justify-end" : "justify-start"
            )}
        >
            {/* Avatar */}
            {!message.isOwn && (
                <div className="w-8">
                    {isGroupBreak && (
                        <UserAvatar
                            type="chat"
                            name={participant?.displayName || "PingMe"}
                            avatarUrl={participant?.avatarUrl ?? undefined}
                        />
                    )}
                </div>
            )}

            {/* message */}
            <div
                className={cn(
                    "max-w-xs lg:max-w-md space-y-1 flex flex-col",
                    message.isOwn ? "items-end" : "items-start"
                )}
            >
                <Card
                    className={cn(
                        "p-3",
                        message.isOwn ? "chat-bubble-sent border-0" : "bg-chat-bubble-received"
                    )}
                >
                    <p className="text-sm leading-relaxed break-word">{message.content}</p>
                </Card>

                {/* time */}
                {isGroupBreak && (
                    <span className="text-xs text-muted-foreground px1">
                        {formatMessageTime(new Date(message.createdAt))}
                    </span>
                )}

                {/* seen / delivered */}
                {message.isOwn && message._id === selectedConvo.lastMessage?._id && (
                    <Badge
                        className={cn(
                            "text-xs px-1.5 py-0.5 h-4 p-0",
                            lastMessageStatus === "seen"
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                        )}
                        variant="outline"
                    >
                        {lastMessageStatus}
                    </Badge>
                )}
            </div>
        </div>
    );
};

export default MessageItem;
