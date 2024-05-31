import React from 'react';
import UploadReceiptForm from '../components/UploadReceiptForm.tsx';
import useAuth from '../hooks/useAuth.tsx';

const ReceiptScan: React.FC = () => {
  const { currentUser } = useAuth();
  return (
    <>
      <h1>Welcome, {currentUser.username}</h1>
      <UploadReceiptForm />
    </>
  );
};

export default ReceiptScan;
