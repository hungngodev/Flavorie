import { VStack } from "@chakra-ui/react";
import useChat from "../../../hooks/useChat";
import { IMessage } from '../../../types/chat';
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";

export const Chat: React.FC = () => {
    const { chat } = useChat();
    return (
        <VStack 
        justify= "space-around"
        h="100%"
        >
            <VStack>
                {chat.messages.map((message: IMessage) => (
                    <ChatBubble
                        message={message}
                        key={
                            message.timestamp + (message?.author || "anonymous")
                        }
                    />
                ))}
            </VStack>
            <ChatInput />
        </VStack>
    );
};
