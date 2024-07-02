import { useEffect, useRef } from "react";

export const VideoPlayer: React.FC<{ stream?: MediaStream }> = ({ stream }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) videoRef.current.srcObject = stream;
    }, [stream]);
    return (
        <video
            data-testid="peer-video"
            style={{ width: "100%" }}
            ref={videoRef}
            autoPlay
            muted={true}
        />
    );
};


// import { useEffect, useRef } from 'react';

// const VideoPlayer = ({
//   localStream,
//   remoteStream,
// }: {
//   localStream: MediaStream | null;
//   remoteStream: MediaStream | null;
// }) => {
//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     if (localStream && localVideoRef.current) {
//       localVideoRef.current.srcObject = localStream;
//     }
//     if (remoteStream && remoteVideoRef.current) {
//       remoteVideoRef.current.srcObject = remoteStream;
//     }
//   }, [localStream, remoteStream]);

//   return (
//     <div>
//       <video ref={localVideoRef} autoPlay muted /> 
//       <video ref={remoteVideoRef} autoPlay />
//     </div>
//   );
// };

// export default VideoPlayer;
