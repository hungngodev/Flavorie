import useChat from "../../../hooks/useChat";
import { IMessage } from '../../../types/chat';
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";

export const Chat: React.FC = () => {
    const { chat } = useChat();
    return (
        <div
            className="flex flex-col  justify-between"
            data-testid="chat"
        >
            <div>
                {chat.messages.map((message: IMessage) => (
                    <ChatBubble
                        message={message}
                        key={
                            message.timestamp + (message?.author || "anonymous")
                        }
                    />
                ))}
            </div>
            <ChatInput />
        </div>
    );
};
