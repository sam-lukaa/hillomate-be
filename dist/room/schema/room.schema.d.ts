import { Document } from 'mongoose';
export type RoomDocument = Room & Document;
export declare class Room {
    roomId: string;
    roomName: string;
    password?: string;
    createdAt: Date;
    members: {
        userId: string;
        role: 'admin' | 'participant';
    }[];
}
export declare const RoomSchema: import("mongoose").Schema<Room, import("mongoose").Model<Room, any, any, any, Document<unknown, any, Room> & Room & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Room, Document<unknown, {}, import("mongoose").FlatRecord<Room>> & import("mongoose").FlatRecord<Room> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
