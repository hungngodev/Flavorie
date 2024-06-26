import { HStack, IconButton } from "@chakra-ui/react";
import { Send } from "lucide-react";
import { useState } from "react";
import { Form } from "react-router-dom";
import { useChat, useRoom, useUser } from '../../../hooks';

export const ChatInput: React.FC = () => {
    const [message, setMessage] = useState("");
    const { sendMessage } = useChat();
    const { userId } = useUser();
    const { roomId } = useRoom();
    return (
            <Form
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(message, roomId, userId);
                    setMessage("");
                }}
            >
               <HStack>
                    <textarea
                        className="border rounded"
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                    />
                    <IconButton
                        type="submit"
                        className="bg-rose-400 p-4 mx-2 rounded-lg text-xl hover:bg-rose-600 text-white"
                        icon={<Send />}
                        aria-label="Send message"
                    />
                </HStack>
            </Form>

    );
};
