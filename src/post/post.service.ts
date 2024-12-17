import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDTO } from './dtos/create-post.dto';
import { Post, PostDocument } from './schemas/post.schema';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<PostDocument>,
  ) {}

  async getAllPosts(): Promise<Post[]> {
    const posts = await this.postModel.find().exec();

    return posts;
  }

  async getPost(id: string): Promise<Post> {
    try {
      const post = await this.postModel.findById(id).exec();

      if (!post) {
        throw new HttpException(
          {
            error: 'Post not found',
            status: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return post;
    } catch (err) {
      throw new HttpException(
        {
          error: 'Error retrieving post',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: err },
      );
    }
  }

  async addPost(postData: CreatePostDTO): Promise<Post> {
    const post = await this.postModel.create(postData);

    return post;
  }

  async updatePost(id: string, updatePost: CreatePostDTO): Promise<Post> {
    const post = await this.postModel
      .findByIdAndUpdate(id, updatePost, { new: true })
      .exec();

    return post;
  }

  async deletePost(id: string): Promise<any> {
    const deletedPost = await this.postModel.findByIdAndDelete(id).exec();

    return deletedPost;
  }
}
