import { NameInput } from "./Name";
import { Button } from "./Button";
import { ws } from '../../providers/RoomProvider';
import { Input } from "@chakra-ui/react";
import {Link} from "react-router-dom";
import { useState } from "react";

const Join: React.FC = () => {
    const [input, setInput] = useState("");
    const createRoom = () => {
        ws.emit("create-room");
    };
    return (
        <div className=" flex flex-col">
            <NameInput />
            <Button onClick={createRoom} className="py-2 px-8 text-xl">
                Start new meeting
            </Button>
            <Input placeholder="Room ID" className="mt-4" 
            value={input} onChange={(e) => setInput(e.target.value)}
            />
            <Link to={`/meeting/room/${input}`}>
                <Button className="py-2 px-8 text-xl">Join meeting</Button>
            </Link>

        </div>
    );
};
export default Join;