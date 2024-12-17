import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomSchema } from './schema/room.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomController } from './room.controller';

@Module({
  providers: [RoomService],
  controllers: [RoomController],
  imports: [MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }])],
})
export class RoomModule {}
