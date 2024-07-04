import useUser from "../../hooks/useUser";
import React, { useState } from 'react';

export const NameInput: React.FC = () => {
    const { userName, setUserName } = useUser(); 
    
    
    return (
        <input
            className="my-2 h-10 w-full rounded-md border border-violet-300 p-2"
            placeholder="Enter your name"
            onChange={(e) => {
                setUserName(e.target.value);
                console.log(e.target.value);
            }}
            value={userName}
        />
    );
};
