import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Chat, ChatButton, NameInput, ShareScreenButton, VideoPlayer } from "../components/meeting";
import useChat from "../hooks/useChat";
import useRoom from '../hooks/useRoom';
import useUser from '../hooks/useUser';
import { ws } from '../providers/RoomProvider';
import { PeerState } from "../reducers/peerReducer";

 const Room = () => {
    const { id } = useParams();
    const { stream, screenStream, peers, shareScreen, screenSharingId, setRoomId } = useRoom();

    const { userName, userId } = useUser();
    const { toggleChat, chat } = useChat();

    useEffect(() => {
        if (stream)
            ws.emit("join-room", { roomId: id, peerId: userId, userName });
    }, [id, userId, stream, userName]);

    useEffect(() => {
        setRoomId(id || "");
    }, [id, setRoomId]);

    const screenSharingVideo =
        screenSharingId === userId
            ? screenStream
            : peers[screenSharingId]?.stream;

    const { [screenSharingId]: sharing, ...peersToShow } = peers;
    console.log(sharing);
    return (
        <div className="flex flex-col min-h-screen">
            <div className="bg-red-500 p-4 text-white">Room id {id}</div>
            <div className="flex grow">
                {screenSharingVideo && (
                    <div className="w-4/5 pr-4">
                        <VideoPlayer stream={screenSharingVideo} />
                    </div>
                )}
                <div
                    className={`grid gap-4 ${
                        screenSharingVideo ? "w-1/5 grid-col-1" : "grid-cols-4"
                    }`}
                >
                    {screenSharingId !== userId && (
                        <div>
                            <VideoPlayer stream={stream} />
                            <NameInput />
                        </div>
                    )}

                    {Object.values(peersToShow as PeerState)
                        .filter((peer) => !!peer.stream)
                        .map((peer) => (
                            <div key={peer.peerId}>
                                <VideoPlayer stream={peer.stream} />
                                <div>{peer.userName}</div>
                            </div>
                        ))}
                </div>
                {chat.isChatOpen && (
                    <div className="border-l-2 pb-28">
                        <Chat />
                    </div>
                )}
            </div>
            <div className="h-28 fixed bottom-0 p-6 w-full flex items-center justify-center border-t-2 bg-white">
                <ShareScreenButton onClick={shareScreen} />
                <ChatButton onClick={toggleChat} />
            </div>
        </div>
    );
};

export default Room;