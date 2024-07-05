import { useEffect, useRef } from 'react';

// interface VideoPlayerProps{
//     stream?: MediaStream
// }
// const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({stream}, ref) => {
export const VideoPlayer: React.FC<{ stream?: MediaStream }> = ({ stream }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) videoRef.current.srcObject = stream;
    }, [stream]);
    return (
        <video
            data-testid="peer-video"
            ref={videoRef}
            autoPlay
            muted={true}
            style={{
                width: '90%',
                height: '90%',
                objectFit: 'cover',
            }}
        />
    );
};
export default VideoPlayer;
