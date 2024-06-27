import Peer from 'peerjs';
import { useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import RoomContext from '../contexts/roomContext';
import useUser from '../hooks/useUser';
import {
    addAllPeersAction,
    addCallAction,
    addPeerConnectionIdAction,
    addPeerNameAction,
    addPeerStreamAction,
    removePeerStreamAction,
} from '../reducers/peerActions';
import { peersReducer } from '../reducers/peerReducer';
import { IPeer } from '../types/peer';

export const WS = 'http://localhost:5100';
export const ws = io(WS, {
    withCredentials: true,
    autoConnect: true,
});

const RoomProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const { userName, userId } = useUser();
    const [me, setMe] = useState<Peer>();
    const [stream, setStream] = useState<MediaStream>();
    const [screenStream, setScreenStream] = useState<MediaStream>();
    const [peers, dispatch] = useReducer(peersReducer, {});
    const [screenSharingId, setScreenSharingId] = useState<string>('');
    const [roomId, setRoomId] = useState<string>('');

    const enterRoom = ({ roomId }: { roomId: 'string' }) => {
        navigate(`/meeting/room/${roomId}`);
    };
    const getUsers = ({ participants }: { participants: Record<string, IPeer> }) => {
        // console.log('get-users', participants);
        dispatch(addAllPeersAction(participants));
    };

    const removePeer = (userId: string) => {
        console.log('user-disconnected', userId);
        dispatch(removePeerStreamAction(userId));
    };

    const switchStream = (stream: MediaStream) => {
        for (const [otherId, peer] of Object.entries(peers)) {
            if (otherId !== userId) {
                const videoTrack: MediaStreamTrack | undefined = stream
                    ?.getTracks()
                    .find((track) => track.kind === 'video');
                // peer.call.peerConnection
                if (videoTrack) {
                    peer.call.peerConnection
                        .getSenders()
                        .find((sender) => sender.track?.kind === 'video')
                        ?.replaceTrack(videoTrack)
                        .catch((err: Error) => console.error(err));
                }
            }
        }
    };

    const shareScreen = () => {
        if (screenSharingId) {
            setScreenSharingId('');
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(switchStream);
            ws.emit('stop-sharing', { roomId });
        } else {
            ws.emit('start-sharing', { userId: userId, roomId });
            console.log('share screen');
            setScreenSharingId(userId);
            navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
                switchStream(stream);
                setScreenStream(stream);
            });
        }
    };

    const nameChangedHandler = ({ userId, userName }: { userId: string; userName: string }) => {
        dispatch(addPeerNameAction(userId, userName));
    };

    const startSharing = (peerId: string) => {
        console.log('user-started-sharing', peerId);
        setScreenSharingId(peerId);
    };
    const stopSharing = () => {
        console.log('user-stopped-sharing');
        setScreenSharingId('');
    };

    useEffect(() => {
        ws.emit('change-name', { userId, userName, roomId });
    }, [userName, userId, roomId]);

    useEffect(() => {
        const peer = new Peer('', {
            host: 'localhost',
            port: 9001,
            path: '/',
        });
        setMe(peer);
        try {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                setStream(stream);
            });
        } catch (error) {
            console.error(error);
        }

        ws.on('room-created', enterRoom);
        ws.on('get-users', getUsers);
        ws.on('user-disconnected', removePeer);
        ws.on('user-started-sharing', startSharing);
        ws.on('user-stopped-sharing', stopSharing);
        ws.on('name-changed', nameChangedHandler);

        return () => {
            ws.off('room-created');
            ws.off('get-users');
            ws.off('user-disconnected');
            ws.off('user-started-sharing');
            ws.off('user-stopped-sharing');
            ws.off('user-joined');
            ws.off('name-changed');
            me?.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect(() => {
    //     if (screenSharingId != '') {
    //         ws.emit('start-sharing', { userId: screenSharingId, roomId });
    //     } else {
    //         ws.emit('stop-sharing');
    //     }
    // }, [screenSharingId, roomId]);

    useEffect(() => {
        if (!me) return;
        if (!stream) return;

        ws.on('user-joined', ({ peerId, userName: name, userId: otherId }) => {
            console.log('user-joined', otherId, name);
            const call = me.call(peerId, stream, {
                metadata: {
                    userName,
                    userId,
                },
            });
            call.on('stream', (peerStream) => {
                dispatch(addPeerStreamAction(otherId, peerStream));
            });
            dispatch(addCallAction(otherId, call));
            dispatch(addPeerConnectionIdAction(otherId, peerId));
            dispatch(addPeerNameAction(otherId, name));
        });

        me.on('call', (call) => {
            const { userName, userId } = call.metadata;
            // console.log('call', userName, userId);
            dispatch(addPeerConnectionIdAction(userId, call.peer));
            dispatch(addPeerNameAction(userId, userName));

            call.answer(stream);
            call.on('stream', (peerStream) => {
                dispatch(addPeerStreamAction(userId, peerStream));
            });
            dispatch(addCallAction(userId, call));
        });

        return () => {
            ws.off('user-joined');
        };
    }, [me, stream, userName, userId]);

    return (
        <RoomContext.Provider
            value={{
                stream,
                screenStream,
                peers,
                shareScreen,
                roomId,
                setRoomId,
                screenSharingId,
                me,
            }}
        >
            {children}
        </RoomContext.Provider>
    );
};
export default RoomProvider;
