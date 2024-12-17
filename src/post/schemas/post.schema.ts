import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop()
  author: string;

  @Prop()
  title: string;

  @Prop()
  excerpt: string;

  @Prop()
  content: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
