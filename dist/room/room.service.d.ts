import { Model } from 'mongoose';
import { Room, RoomDocument } from './schema/room.schema';
export declare class RoomService {
    private readonly roomModel;
    constructor(roomModel: Model<RoomDocument>);
    private agoraAppId;
    private agoraAppCertificate;
    private generateUserId;
    private generateAgoraToken;
    createRoom(roomName: string, password?: string): Promise<{
        room: Room;
        userId: string;
        token: string;
    }>;
    joinRoom(roomId: string, password?: string): Promise<{
        room: Omit<Room, 'password'>;
        userId: string;
        token: string;
    }>;
    leaveRoom(roomId: string, userId: string): Promise<Omit<Room, 'password'>>;
    getRoom(roomId: string): Promise<Omit<Room, 'password'>>;
}
