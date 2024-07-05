import React, { useRef, useEffect } from 'react';
import axios from 'axios';
import VideoPlayer from '../components/meeting/VideoPlayer';

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function getCameraStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    }

    getCameraStream();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // const sendFrameToServer = async () => {
  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext('2d');
  //   context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  //   const dataUrl = canvas.toDataURL('image/jpeg');
  //   const blob = await (await fetch(dataUrl)).blob();
    
  //   const formData = new FormData();
  //   formData.append('image', blob, 'frame.jpg');

  //   try {
  //     await axios.post('http://127.0.0.1:5001/virtual-mouse', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });
  //   } catch (err) {
  //     console.error('Error sending frame to server:', err);
  //   }
  // };

  // useEffect(() => {
  //   const interval = setInterval(sendFrameToServer, 100); 
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div>
      <h2>Browser Camera Stream</h2>
      <VideoPlayer ref={videoRef} />
      {/* <video ref={videoRef} autoPlay style={{ display: 'none' }} /> */}
      <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480" />
    </div>
  );
};

export default CameraComponent;
