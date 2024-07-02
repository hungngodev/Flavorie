import React from 'react';
import {ChatState } from '../reducers/chatReducer';

export type ChatContextType = {
    chat: ChatState;
    sendMessage: (message: string, roomId: string, author: string) => void;
    toggleChat: () => void;
};

const ChatContext = React.createContext<ChatContextType>({
    chat: {
        messages: [],
        isChatOpen: false,
    },
    sendMessage: () => {},
    toggleChat: () => {},
});

export default ChatContext;
