import { useContext } from 'react';
import ChatContext from '../contexts/chatContext';

const useChat = () => {
  return useContext(ChatContext);
};
export default useChat;
