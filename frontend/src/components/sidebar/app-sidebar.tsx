import * as React from "react";

import { NavUser } from "@/components/sidebar/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Moon, Sun } from "lucide-react";
import { Switch } from "../ui/switch";
import CreateNewChat from "../chat/CreateNewChat";
import NewGroupChatModel from "../chat/NewGroupChatModel";
import GroupChatList from "../chat/GroupChatList";
import AddFriendModal from "../chat/AddFriendModal";
import DirectMessageList from "../chat/DirectMessageList";
import { useThemeStore } from "@/stores/useThemeStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { isDark, toggleTheme } = useThemeStore();
    const { user } = useAuthStore();
    const { fetchConversations } = useChatStore();

    // React.useEffect(() => {
    //     if (user) {
    //         fetchConversations();
    //     }
    // }, [user, fetchConversations]);

    return (
        <Sidebar variant="inset" {...props}>
            {/* Header */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="bg-gradient-primary">
                            <a href="#">
                                <div className="w-full flex items-center px-2 justify-between">
                                    <h1 className="text-xl font-bold text-white">PingMe</h1>
                                    <div className="flex items-center gap-2">
                                        <Sun className="size-4 text-white/80" />
                                        <Switch
                                            checked={isDark}
                                            onCheckedChange={toggleTheme}
                                            className="data=[state=checked]:bg-background/80"
                                        />
                                        <Moon className="size-4 text-white/80" />
                                    </div>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Cpontent */}
            <SidebarContent className="beautiful-scrollbar">
                {/* New Chat */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <CreateNewChat />
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Group Chat */}
                <SidebarGroup>
                    <div className="flex items-center justify-between">
                        <SidebarGroupLabel className="uppercase">Nhóm chat</SidebarGroupLabel>
                        <NewGroupChatModel />
                    </div>

                    <SidebarGroupContent>
                        <GroupChatList />
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Direct Message */}
                <SidebarGroup>
                    <SidebarGroupLabel className="uppercase">Bạn bè</SidebarGroupLabel>
                    <SidebarGroupAction className="cursor-pointer" title="Kết bạn">
                        <AddFriendModal />
                    </SidebarGroupAction>

                    <SidebarGroupContent>
                        <DirectMessageList />
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
        </Sidebar>
    );
}
