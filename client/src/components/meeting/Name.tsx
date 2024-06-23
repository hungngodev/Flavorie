import useUser from "../../hooks/useUser";

export const NameInput: React.FC = () => {
    const { userName, setUserName } = useUser(); 
    return (
        <input
            className="border rounded-md p-2 h-10 my-2 w-full"
            placeholder="Enter your name"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
        />
    );
};
