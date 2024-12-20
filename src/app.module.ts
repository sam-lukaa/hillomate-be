import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    RoomModule,
    PostModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(`${process.env.MONGO_URI}`),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
