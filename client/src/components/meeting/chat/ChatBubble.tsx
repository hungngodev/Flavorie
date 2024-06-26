import { useRoom, useUser } from '../../../hooks';
import { IMessage } from '../../../types/chat';
import { cn } from '../../../utils/cn';

export const ChatBubble: React.FC<{ message: IMessage }> = ({ message }) => {
    const { peers } = useRoom();
    const { userId } = useUser();
    console.log(message);
    console.log(peers);
    const author = message.author && peers[message.author].userName;
    const userName = author || 'Anonimus';
    const isSelf = message.author === userId;
    const time = new Date(message.timestamp).toLocaleTimeString();
    return (
        <div
            className={cn('m-2 flex', {
                'justify-end pl-10': isSelf,
                'justify-start pr-10': !isSelf,
            })}
        >
            <div className="flex flex-col">
                <div
                    className={cn('inline-block rounded px-4 py-2', {
                        'bg-red-200': isSelf,
                        'bg-red-300': !isSelf,
                    })}
                >
                    {message.content}
                    <div
                        className={cn('text-xs opacity-50', {
                            'text-right': isSelf,
                            'text-left': !isSelf,
                        })}
                    >
                        {time}
                    </div>
                </div>
                <div
                    className={cn('text-md', {
                        'text-right': isSelf,
                        'text-left': !isSelf,
                    })}
                >
                    {isSelf ? 'You' : userName}
                </div>
            </div>
        </div>
    );
};
