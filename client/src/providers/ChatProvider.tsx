import { useEffect, useReducer } from "react";
import ChatContext from "../contexts/chatContext";
import {
    addHistoryAction,
    addMessageAction,
    toggleChatAction,
} from "../reducers/chatActions";
import { chatReducer } from "../reducers/chatReducer";
import { IMessage } from "../types/chat";
import { ws } from "./RoomProvider";

const ChatProvider= ({ children }: {
    children: React.ReactNode;

}) => {
    const [chat, chatDispatch] = useReducer(chatReducer, {
        messages: [

        ],
        isChatOpen: false,
    });
   
    const sendMessage = (message: string, roomId: string, author: string) => {
        const messageData: IMessage = {
            content: message,
            timestamp: new Date().getTime(),
            author,
        };
        chatDispatch(addMessageAction(messageData));

        ws.emit("send-message", roomId, messageData);
    };

    const addMessage = (message: IMessage) => {
        chatDispatch(addMessageAction(message));
    };

    const addHistory = (messages: IMessage[]) => {
        chatDispatch(addHistoryAction(messages));
    };

    const toggleChat = () => {
        chatDispatch(toggleChatAction(!chat.isChatOpen));
    };
    useEffect(() => {
        ws.on("add-message", addMessage);
        ws.on("get-messages", addHistory);
        return () => {
            ws.off("add-message", addMessage);
            ws.off("get-messages", addHistory);
        };
    }, []);
    return (
        <ChatContext.Provider
            value={{
                chat,
                sendMessage,
                toggleChat,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;