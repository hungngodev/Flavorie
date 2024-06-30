import { Peer } from 'peerjs';
import React from 'react';
import { PeerState } from '../reducers/peerReducer';

export type RoomContextType = {
    stream?: MediaStream;
    screenStream?: MediaStream;
    peers: PeerState;
    shareScreen: () => void;
    roomId: string;
    setRoomId: (id: string) => void;
    screenSharingId: string;
    me?: Peer;
    toggleVideo: () => void;
    toggleMic: () => void;
    videoStatus: boolean;
    micStatus: boolean;
};

const RoomContext = React.createContext<RoomContextType>({
    peers: {},
    shareScreen: () => {},
    setRoomId: () => {},
    screenSharingId: '',
    roomId: '',
    toggleVideo: () => {},
    toggleMic: () => {},
    videoStatus: true,
    micStatus: true,
});

export default RoomContext;
