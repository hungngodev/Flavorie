import CameraComponent from '../../pages/mouse';
import React, { useState } from 'react';

const CustomCam = () => {
  const [cameraOpen, setCameraOpen] = useState(false);

  return (
    <div>
      <h1>Web App with Webcam Stream</h1>
      <button onClick={() => setCameraOpen(!cameraOpen)}>
        {cameraOpen ? 'Close Camera' : 'Open Camera'}
      </button>
      {cameraOpen && <CameraComponent />}
    </div>
  );
};

export default CustomCam;
