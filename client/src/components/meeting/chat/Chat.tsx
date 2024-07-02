import { Grid, GridItem, VStack } from '@chakra-ui/react';
import useChat from '../../../hooks/useChat';
import { IMessage } from '../../../types/chat';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';

export const Chat: React.FC = () => {
    const { chat } = useChat();
    return (
        <Grid
            templateRows="repeat(14, 1fr)"
            templateColumns="repeat(1, 1fr)"
            h="100%"
            border="2px solid"
            borderColor="black"
            borderBottom={'none'}
            rounded={'xl'}
        >
            <GridItem rowSpan={13} colSpan={1} overflowY="auto" p={4}>
                <VStack width="100%" height="100%">
                    {chat.messages.map((message: IMessage) => (
                        <ChatBubble message={message} key={message.timestamp + (message?.author || 'anonymous')} />
                    ))}
                </VStack>
            </GridItem>
            <GridItem rowSpan={1} colSpan={1} justifyContent={'center'} alignItems={'center'}>
                <ChatInput />
            </GridItem>
        </Grid>
    );
};
