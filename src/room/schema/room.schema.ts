import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RoomDocument = Room & Document;

@Schema()
export class Room {
  @Prop({ required: true })
  roomId: string;

  @Prop({ required: true })
  roomName: string;

  @Prop()
  password?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({
    type: [
      {
        userId: { type: String, required: true },
        role: { type: String, enum: ['admin', 'participant'], required: true },
      },
    ],
    default: [],
  })
  members: { userId: string; role: 'admin' | 'participant' }[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
