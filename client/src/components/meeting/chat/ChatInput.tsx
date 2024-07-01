import { HStack, IconButton } from '@chakra-ui/react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Send } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { Form } from 'react-router-dom';
import { useChat, useRoom, useUser } from '../../../hooks';
import { cn } from '../../../utils/cn';

export const ChatInput: React.FC = () => {
    const [message, setMessage] = useState('');
    const { sendMessage } = useChat();
    const { userId } = useUser();
    const { roomId } = useRoom();

    const radius = 200;
    const [visible, setVisible] = React.useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({
        currentTarget,
        clientX,
        clientY,
    }: {
        currentTarget: HTMLDivElement;
        clientX: number;
        clientY: number;
    }) {
        const { left, top } = currentTarget.getBoundingClientRect();

        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }
    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault();
                sendMessage(message, roomId, userId);
                setMessage('');
            }}
            className="flex h-full w-full items-center justify-center rounded-lg p-2"
        >
            <HStack gap={0} width="95%">
                <motion.div
                    style={{
                        background: useMotionTemplate`
                        radial-gradient(
                        ${visible ? radius + 'px' : '0px'} circle at ${mouseX}px ${mouseY}px,
                        var(--blue-500),
                        transparent 80%
                        )
                    `,
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setVisible(true)}
                    onMouseLeave={() => setVisible(false)}
                    className="group/input w-full rounded-lg p-[2px] transition duration-300"
                >
                    <input
                        type={'text'}
                        className={cn(
                            `dark:placeholder-text-neutral-600 duration-400 flex h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black shadow-input  transition file:border-0 
          file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 
          focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-400 disabled:cursor-not-allowed
           disabled:opacity-50 group-hover/input:shadow-none
           dark:bg-zinc-800
           dark:text-white dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] dark:focus-visible:ring-neutral-600
           `,
                            '',
                        )}
                        placeholder={'Type a message'}
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                    />
                </motion.div>
                <IconButton
                    type="submit"
                    className="mx-2 rounded-lg bg-rose-400 p-4 text-xl text-white hover:bg-rose-600"
                    icon={<Send />}
                    aria-label="Send message"
                />
            </HStack>
        </Form>
    );
};
