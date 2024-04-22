import { Button, Link } from '@chakra-ui/react';
import React from 'react';
import { CiCircleCheck, CiLogin } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/';
import customFetch from '../utils/customFetch';
const Main: React.FC = () => {
  const auth = useAuth();
  console.dir(auth);
  return (
    <div>
      {auth.currentUser.username && <h1>Welcome {auth.currentUser.username}</h1>}
      {auth.currentUser.username !== '' ? (
        <Button
          onClick={async () => {
            try {
              const logOutRequest = await customFetch.get('/auth/logout', {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              });
              if (logOutRequest.status === 200) {
                toast.success('Logged out successfully!', { position: 'top-right', icon: <CiCircleCheck /> });
                auth.logout();
              }
            } catch (error) {
              toast.error('Error during logging out, please try later!', { position: 'top-right', icon: <CiLogin /> });
            }
          }}
        >
          Logout
        </Button>
      ) : (
        <div>
          <Link href="/register">
            <Button>Register Account</Button>
          </Link>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      )}
    </div>
  );
};
export default Main;
