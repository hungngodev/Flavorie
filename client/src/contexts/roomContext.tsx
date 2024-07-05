import { Peer } from 'peerjs';
import React from 'react';
import { BackendData } from '../components/meals/ImageSlide';
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
    currentMeal: string;
    setCurrentMeal: (meal: string) => void;
    mealDatas: BackendData[];
    currentMealInfo: BackendData;
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
    currentMeal: '',
    setCurrentMeal: () => {},
    mealDatas: [],
    currentMealInfo: {} as BackendData,
});

export default RoomContext;
