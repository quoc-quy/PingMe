import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import { set } from "zod";
import type { SocketState } from "@/types/store";

const baseUrl = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    connectSocket: () => {
        const accessToken = useAuthStore.getState().accessToken;
        const existingSocket = get().socket;
        if (existingSocket) return; // tránh tạo nhiều socket

        const socket: Socket = io(baseUrl, {
            auth: { token: accessToken },
            transports: ["websocket"],
        });

        set({ socket });

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
        });
    },
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null });
            console.log("Socket disconnected");
        }
    },
}));
