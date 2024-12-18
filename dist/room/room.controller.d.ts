import { RoomService } from './room.service';
export declare class RoomController {
    private readonly roomService;
    constructor(roomService: RoomService);
    handleRoom(action: 'create' | 'join', roomId?: string, roomName?: string, password?: string): Promise<{
        room: Omit<import("./schema/room.schema").Room, "password">;
        userId: string;
        token: string;
    }>;
    leaveRoom(userId: string, roomId: string): Promise<Omit<import("./schema/room.schema").Room, "password">>;
    getRoom(roomId: string): Promise<Omit<import("./schema/room.schema").Room, "password">>;
}
