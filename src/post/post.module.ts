import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './schemas/post.schema';
import { PostController } from './post.controller';

@Module({
  providers: [PostService],
  controllers: [PostController],
  imports: [MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }])],
})
export class PostModule {}
