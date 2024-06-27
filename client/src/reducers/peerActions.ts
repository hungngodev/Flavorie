import { MediaConnection } from 'peerjs';
import { IPeer } from '../types/peer';

export const ADD_PEER_STREAM = 'ADD_PEER_STREAM' as const;
export const REMOVE_PEER_STREAM = 'REMOVE_PEER_STREAM' as const;
export const ADD_PEER_NAME = 'ADD_PEER_NAME' as const;
export const ADD_ALL_PEERS = 'ADD_ALL_PEERS' as const;
export const ADD_PEER_CONNECTION_ID = 'ADD_PEER_CONNECTION_ID' as const;
export const ADD_CALL_ACTION = 'ADD_CALL_ACTION' as const;

export const addPeerStreamAction = (userId: string, stream: MediaStream) => ({
    type: ADD_PEER_STREAM,
    payload: { userId, stream },
});
export const addPeerNameAction = (userId: string, userName: string) => ({
    type: ADD_PEER_NAME,
    payload: { userId, userName },
});
export const addPeerConnectionIdAction = (userId: string, peerId: string) => ({
    type: ADD_PEER_CONNECTION_ID,
    payload: { userId, peerId },
});
export const removePeerStreamAction = (userId: string) => ({
    type: REMOVE_PEER_STREAM,
    payload: { userId },
});

export const addAllPeersAction = (peers: Record<string, IPeer>) => ({
    type: ADD_ALL_PEERS,
    payload: { peers },
});

export const addCallAction = (userId: string, call: MediaConnection) => ({
    type: ADD_CALL_ACTION,
    payload: { userId, call },
});
