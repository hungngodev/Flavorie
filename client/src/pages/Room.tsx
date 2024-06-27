import { Button, HStack, IconButton, VStack } from '@chakra-ui/react';
import { Clipboard, MessageSquare, MonitorUp } from 'lucide-react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Chat, NameInput, VideoPlayer } from '../components/meeting';
import { useChat, useRoom, useUser } from '../hooks';
import { ws } from '../providers/RoomProvider';
import { PeerState } from '../reducers/peerReducer';

const Room = () => {
    const { id } = useParams();
    const { stream, screenStream, peers, shareScreen, screenSharingId, setRoomId, me } = useRoom();
    const { userName, userId } = useUser();
    const { toggleChat, chat } = useChat();

    useEffect(() => {
        if (stream) ws.emit('join-room', { roomId: id, peerId: me?.id, userName, userId });
    }, [id, me?.id, stream, userName, userId]);

    useEffect(() => {
        setRoomId(id || '');
    }, [id, setRoomId]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    useEffect(() => {
        console.log(screenSharingId);
    }, [screenSharingId]);
    const { [screenSharingId]: sharing, ...peersToShow } = peers;
    // console.log(sharing);

    const screenSharingVideo = screenSharingId === userId ? screenStream : peers[screenSharingId]?.stream;

    return (
        <VStack height="100%" width="100%">
            <div className="flex grow">
                {screenSharingVideo && (
                    <div className="w-4/5 pr-4">
                        <VideoPlayer stream={screenSharingVideo} />
                    </div>
                )}
                <div className={`grid gap-4 ${screenSharingVideo ? 'grid-col-1 w-1/5' : 'grid-cols-4'}`}>
                    {screenSharingId !== userId && (
                        <div>
                            <VideoPlayer stream={stream} />
                            <NameInput />
                            {userId}
                        </div>
                    )}

                    {Object.values(peersToShow as PeerState)
                        .filter((peer) => !!peer.stream)
                        .map((peer, index) => (
                            <div key={peer.userId + index}>
                                <VideoPlayer stream={peer.stream} />
                                <div>{peer.userName}</div>
                                <div>{peer.userId}</div>
                            </div>
                        ))}
                </div>
                {chat.isChatOpen && (
                    <div className="border-l-2 pb-28">
                        <Chat />
                    </div>
                )}
            </div>
            <HStack>
                <Button
                    leftIcon={<Clipboard />}
                    variant="solid"
                    onClick={() => navigator.clipboard.writeText(id || '')}
                >
                    Copy room Id
                </Button>
                <IconButton onClick={shareScreen} icon={<MonitorUp />} aria-label="Share screen" />
                <IconButton
                    onClick={() => {
                        toggleChat();
                    }}
                    color={'black'}
                    icon={<MessageSquare />}
                    aria-label="Toggle chat"
                />
            </HStack>
        </VStack>
    );
};

export default Room;
