// import { Post } from './schemas/post.schema';
import { PostService } from './post.service';
import { CreatePostDTO } from './dtos/create-post.dto';
import {
  Controller,
  Body,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('/:id')
  async getPost(@Param('id') id: string) {
    const post = await this.postService.getPost(id);

    return post;
  }

  @Get('/')
  async getPosts() {
    const posts = await this.postService.getAllPosts();

    return posts;
  }

  @Post('/')
  async createPost(@Body() createPost: CreatePostDTO) {
    const post = await this.postService.addPost(createPost);

    return post;
  }

  @Put('/:id')
  async updatePost(@Param('id') id: string, @Body() updatePost: CreatePostDTO) {
    const post = await this.postService.updatePost(id, updatePost);

    return post;
  }

  @Delete('/:id')
  async deletePost(@Param('id') id: string) {
    const post = await this.postService.deletePost(id);

    return post;
  }
}
