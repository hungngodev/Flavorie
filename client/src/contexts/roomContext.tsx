import React from 'react';
import {PeerState} from '../reducers/peerReducer';

export type RoomContextType = {
    stream?: MediaStream;
    screenStream?: MediaStream;
    peers: PeerState;
    shareScreen: () => void;
    roomId: string;
    setRoomId: (id: string) => void;
    screenSharingId: string;
};

const RoomContext = React.createContext<RoomContextType>({
    peers: {},
    shareScreen: () => {},
    setRoomId: () => {},
    screenSharingId: "",
    roomId: "",
});

export default RoomContext;
