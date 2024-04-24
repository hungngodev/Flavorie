import { useContext } from 'react';
import AuthContext from '../contexts/authContext';

const useAuth = () => {
  return useContext(AuthContext);
};
export default useAuth;
