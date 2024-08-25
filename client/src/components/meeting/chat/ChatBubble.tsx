import { VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useRoom, useUser } from '../../../hooks';
import { IMessage } from '../../../types/chat';
import { cn } from '../../../utils/cn';

export const ChatBubble: React.FC<{ message: IMessage }> = ({ message }) => {
    const { peers } = useRoom();
    const { userId } = useUser();
    if (Object.keys(peers).length === 0) return null;
    const author = message.author && peers[message.author].userName;
    const userName = author || 'Anonimus';
    const isSelf = message.author === userId;
    const time = new Date(message.timestamp).toLocaleTimeString();

    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className={cn(`flex w-full`, {
                'justify-start': !isSelf,
                'justify-end': isSelf,
            })}
        >
            <VStack alignItems={isSelf ? 'flex-end' : 'flex-start'}>
                <VStack width="min-content">
                    <div
                        className={cn('text-md', {
                            'text-right': isSelf,
                            'text-left': !isSelf,
                        })}
                    >
                        {isSelf ? 'You' : userName.slice(0, 4)}
                    </div>
                    <div
                        className={cn(`flex w-full max-w-xl py-2 text-white`, {
                            'rounded-bl-xl rounded-tl-xl rounded-tr-2xl bg-gradient-to-r from-purple-500 to-blue-600 pl-3 pr-2 text-right':
                                isSelf,
                            'rounded-br-xl rounded-tl-2xl rounded-tr-xl bg-gradient-to-r from-blue-500 to-purple-600 pl-2 pr-3 text-left':
                                !isSelf,
                        })}
                        // className={cn('inline-block  px-4 py-2', {
                        //     'bg-red-200': isSelf,
                        //     'bg-red-300': !isSelf,
                        // })}
                    >
                        {message.content}
                    </div>
                </VStack>
                <div
                    className={cn('text-xs opacity-50', {
                        'text-right': isSelf,
                        'text-left': !isSelf,
                    })}
                >
                    {time}
                </div>
            </VStack>
        </motion.div>
    );
};
