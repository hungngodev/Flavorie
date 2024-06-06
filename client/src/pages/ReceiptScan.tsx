import React from 'react';
import UploadReceiptForm from '../components/UploadReceiptForm.tsx';
import useAuth from '../hooks/useAuth.tsx';
import ImageScan from '../components/ingredients/ImageScan.tsx';

const ReceiptScan: React.FC = () => {
  const { currentUser } = useAuth();
  return (
    <>
      <h1>Welcome, {currentUser.username}</h1>
            <ImageScan />

      <UploadReceiptForm />
    </>
  );
};

export default ReceiptScan;
