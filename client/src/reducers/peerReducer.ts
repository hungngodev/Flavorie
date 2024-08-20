import { MediaConnection } from 'peerjs';
import { IPeer } from '../types/peer';
import {
    ADD_ALL_PEERS,
    ADD_CALL_ACTION,
    ADD_PEER_CONNECTION_ID,
    ADD_PEER_NAME,
    ADD_PEER_STREAM,
    REMOVE_PEER_STREAM,
    TOGGLE_VIDEO,
} from './peerActions';

export type PeerState = Record<
    string,
    {
        stream?: MediaStream;
        userName?: string;
        userId: string;
        call: MediaConnection;
        videoStatus?: boolean;
    }
>;
type PeerAction =
    | {
          type: typeof ADD_PEER_STREAM;
          payload: { userId: string; stream: MediaStream };
      }
    | {
          type: typeof REMOVE_PEER_STREAM;
          payload: { userId: string };
      }
    | {
          type: typeof ADD_PEER_NAME;
          payload: { userId: string; userName: string };
      }
    | {
          type: typeof ADD_PEER_CONNECTION_ID;
          payload: { userId: string; peerId: string };
      }
    | {
          type: typeof ADD_CALL_ACTION;
          payload: { userId: string; call: MediaConnection };
      }
    | {
          type: typeof ADD_ALL_PEERS;
          payload: { peers: Record<string, IPeer> };
      }
    | {
          type: typeof TOGGLE_VIDEO;
          payload: { userId: string };
      };

export const peersReducer = (state: PeerState, action: PeerAction) => {
    switch (action.type) {
        case ADD_PEER_STREAM:
            return {
                ...state,
                [action.payload.userId]: {
                    ...state[action.payload.userId],
                    stream: action.payload.stream,
                },
            };
        case ADD_PEER_NAME:
            return {
                ...state,
                [action.payload.userId]: {
                    ...state[action.payload.userId],
                    userName: action.payload.userName,
                },
            };
        case ADD_PEER_CONNECTION_ID:
            return {
                ...state,
                [action.payload.userId]: {
                    ...state[action.payload.userId],
                    peerId: action.payload.peerId,
                },
            };
        case REMOVE_PEER_STREAM:
            return {
                ...state,
                [action.payload.userId]: {
                    ...state[action.payload.userId],
                    stream: undefined,
                },
            };

        case ADD_CALL_ACTION:
            return {
                ...state,
                [action.payload.userId]: {
                    ...state[action.payload.userId],
                    call: action.payload.call,
                },
            };
        case ADD_ALL_PEERS:
            return { ...state, ...action.payload.peers };

        case TOGGLE_VIDEO:
            return {
                ...state,
                [action.payload.userId]: {
                    ...state[action.payload.userId],
                    videoStatus: !state[action.payload.userId].videoStatus,
                },
            };
        default:
            return { ...state };
    }
};
