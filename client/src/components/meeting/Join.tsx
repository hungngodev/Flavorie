import { NameInput } from "./Name";
import { Button } from "./Button";
import { ws } from '../../providers/RoomProvider';

const Join: React.FC = () => {
    const createRoom = () => {
        ws.emit("create-room");
    };
    return (
        <div className=" flex flex-col">
            <NameInput />
            <Button onClick={createRoom} className="py-2 px-8 text-xl">
                Start new meeting
            </Button>
        </div>
    );
};
export default Join;