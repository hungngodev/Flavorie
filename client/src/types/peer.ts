import { MediaConnection } from 'peerjs';

export interface IPeer {
    userName: string;
    userId: string;
    peerId: string;
    call: MediaConnection;
}
