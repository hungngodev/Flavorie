import { NameInput } from "./Name";
import { Button } from "./Button";
import { ws } from '../../providers/RoomProvider';
import { Input } from "@chakra-ui/react";
import {Link} from "react-router-dom";
import { useState } from "react";
import theme from "../../style/theme";

const Join: React.FC = () => {
    const [input, setInput] = useState("");
    const createRoom = () => {
        ws.emit("create-room");
    };
    return (
        <div className=" flex flex-col">
            <NameInput />
            <Button onClick={createRoom} className="px-8 py-2 text-xl">
                Start new meeting
            </Button>
            <Input
                borderColor={input ? theme.colors.palette_purple : theme.colors.palette_indigo}
                focusBorderColor={theme.colors.palette_purple}
                placeholder="Room ID"
                className="mt-5"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <Link to={`/meeting/room/${input}`}>
                <Button className="mt-2 px-8 py-2 text-xl">Join meeting</Button>
            </Link>
        </div>
    );
};
export default Join;