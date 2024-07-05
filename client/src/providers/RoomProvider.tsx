// import Peer from 'peerjs';
import { useQuery } from '@tanstack/react-query';
import Peer from 'peerjs';
import { useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackendData } from '../components/meals/ImageSlide';
import RoomContext from '../contexts/roomContext';
import useUser from '../hooks/useUser';
import {
    addAllPeersAction,
    addCallAction,
    addPeerConnectionIdAction,
    addPeerNameAction,
    addPeerStreamAction,
    removePeerStreamAction,
    toggleVideoAction,
} from '../reducers/peerActions';
import { peersReducer } from '../reducers/peerReducer';
import socket from '../socket/socketio';
import { IPeer } from '../types/peer';
import customFetch from '../utils/customFetch';

export const WS = 'http://localhost:5100';
export const ws = socket;

const likedMealQuery = {
    queryKey: ['likedMeal'],
    queryFn: async () => {
        const response = await customFetch.get('/user/likedMeal');
        return response;
    },
};

const RoomProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const { userName, userId } = useUser();
    const [me, setMe] = useState<Peer>();
    const [stream, setStream] = useState<MediaStream>();
    const [screenStream, setScreenStream] = useState<MediaStream>();
    const [peers, dispatch] = useReducer(peersReducer, {});
    const [screenSharingId, setScreenSharingId] = useState<string>('');
    const [roomId, setRoomId] = useState<string>('');
    const [videoStatus, setVideoStatus] = useState(true);
    const [micStatus, setMicStatus] = useState(true);
    const [currentMeal, setCurrentMealRaw] = useState<string>('');
    const [currentMealData, setCurrentMealData] = useState<BackendData>();
    console.log(currentMealData);

    const { data: likedMeal, status } = useQuery(likedMealQuery);
    const mealDatas = status !== 'pending' ? likedMeal?.data?.likedMeals.map((meal: any) => meal.likedMeal) : [];

    const setCurrentMeal = (currentMealChoice: string) => {
        setCurrentMealRaw(currentMealChoice);
        setCurrentMealData(mealDatas.find((mealData: any) => mealData.title === currentMealChoice));
        ws.emit('change-meal', {
            roomId,
            mealId: currentMealChoice,
            mealInfo: mealDatas.find((mealData: any) => mealData.title === currentMealChoice),
        });
    };

    const enterRoom = ({ roomId }: { roomId: 'string' }) => {
        navigate(`/meeting/room/${roomId}`);
        window.location.reload();
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
                if (videoTrack) {
                    peer.call.peerConnection
                        .getSenders()
                        .find((sender) => sender.track?.kind === 'video')
                        ?.replaceTrack(videoTrack)
                        .catch((err: Error) => console.error(err));
                } else {
                    console.log('No video');
                }
            }
        }
    };

    const toggleVideo = async () => {
        if (videoStatus) {
            setVideoStatus(false);
            const videoStream = createPlaceholderTrack();
            setStream(videoStream);
            for (const [otherId, peer] of Object.entries(peers)) {
                if (otherId !== userId) {
                    const connection = peer.call.peerConnection
                        .getSenders()
                        .find((sender) => sender.track?.kind === 'video');
                    if (connection && connection.track) {
                        connection.track.stop();
                    }
                }
            }
        } else {
            setVideoStatus(true);
            try {
                const videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(videoStream);
                switchStream(videoStream);
            } catch (e) {
                console.log(e);
            }
        }
        ws.emit('toggle-video', { roomId, userId });
    };
    // useEffect(() => {
    //     console.log(peers);
    // }, [peers]);

    const toggleMic = async () => {
        if (micStatus) {
            setMicStatus(false);
            const audioStream = await navigator.mediaDevices.getUserMedia({ video: videoStatus, audio: false });
            setStream(audioStream);
            switchStream(audioStream);
        } else {
            setMicStatus(true);
            const audioStream = await navigator.mediaDevices.getUserMedia({ video: videoStatus, audio: true });
            setStream(audioStream);
            switchStream(audioStream);
        }
    };

    const shareScreen = async () => {
        if (screenSharingId) {
            setScreenSharingId('');
            const myStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            switchStream(myStream);
            ws.emit('stop-sharing', { roomId });
        } else {
            console.log('share screen');
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({});
                switchStream(stream);
                setScreenStream(stream);

                ws.emit('start-sharing', { userId: userId, roomId });
                setScreenSharingId(userId);
            } catch (error) {
                console.log('Permission denied');
                console.error(error);
                setScreenSharingId('');
                ws.emit('stop-sharing', { roomId });
            }
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

    const videoChange = (userId: string) => {
        console.log('user-toggle-video', userId);
        setScreenSharingId('random' + Math.random());
        dispatch(toggleVideoAction(userId));
        window.location.reload();
    };

    const mealChange = (mealData: { currentMeal: string; mealInfo: BackendData }) => {
        console.log('meal-changed', mealData);
        setCurrentMealRaw(mealData.currentMeal);
        setCurrentMealData(mealData.mealInfo);
    };

    useEffect(() => {
        ws.emit('change-name', { userId, userName, roomId });
    }, [userName, userId, roomId]);

    useEffect(() => {
        const peer = new Peer('');
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
        ws.on('user-toggle-video', videoChange);
        ws.on('meal-changed', mealChange);

        return () => {
            ws.off('room-created');
            ws.off('get-users');
            ws.off('user-disconnected');
            ws.off('user-started-sharing');
            ws.off('user-stopped-sharing');
            ws.off('user-joined');
            ws.off('name-changed');
            ws.off('user-toggle-video');
            me?.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                toggleVideo,
                toggleMic,
                videoStatus,
                micStatus,
                currentMeal,
                setCurrentMeal,
                mealDatas,
                currentMealInfo: currentMealData as BackendData,
            }}
        >
            {children}
        </RoomContext.Provider>
    );
};
export default RoomProvider;

function createPlaceholderTrack() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 640;
    canvas.height = 480;

    // Draw a placeholder image or color
    if (context !== null) {
        context.fillStyle = '#000000'; // black background
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#FFFFFF'; // white text
        context.font = '30px Arial';
        context.fillText('Camera Off', 180, 240);
    }

    // Get a MediaStream from the canvas
    const stream = canvas.captureStream(15); // 15 FPS
    return stream;
}
