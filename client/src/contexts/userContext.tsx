import React from 'react';

export type UserContextType = {
    userId: string;
    userName: string;
    setUserName: (userName: string) => void;
};

const UserContext = React.createContext<UserContextType>({
    userId: "",
    userName: "",
    setUserName: (userName: string) => {},
});

export default UserContext;
