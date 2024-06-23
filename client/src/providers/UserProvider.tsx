import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import UserContext from "../contexts/userContext";

export const UserProvider= ({ children }: {
    children: React.ReactNode;
}) => {
    const [userId] = useState(localStorage.getItem("userId") || uuidV4());
    const [userName, setUserName] = useState(
        localStorage.getItem("userName") || ""
    );

    useEffect(() => {
        const userName = uuidV4();
        localStorage.setItem("userName", userName);
    }, [userName]);

    useEffect(() => {
        const userId = uuidV4();
        localStorage.setItem("userId", userId);
    }, [userId]);

    return (
        <UserContext.Provider value={{ userId, userName, setUserName }}>
            {children}
        </UserContext.Provider>
    );
};
export default UserProvider;