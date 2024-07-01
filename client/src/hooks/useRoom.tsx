import { useContext } from 'react';
import RoomContext from '../contexts/roomContext';

const useRoom = () => {
  return useContext(RoomContext);
};
export default useRoom;
