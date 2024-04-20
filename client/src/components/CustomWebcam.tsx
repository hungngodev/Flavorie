import Webcam from "react-webcam";
import React, { useCallback, useRef, useState } from "react";

const CustomWebcam: React.FC = () => {
  const webcamRef = useRef<Webcam>(null); //create a webcam reference
  const [imgSrc, setImgSrc] = useState<string | null>(null); 

  // capture function
  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot(); 
      setImgSrc(imageSrc);
    }
  }, [webcamRef]);

    return (
        <div className="container">
        <Webcam height={600} width={600} ref={webcamRef} />
        </div>
    );
    };

export default CustomWebcam;
