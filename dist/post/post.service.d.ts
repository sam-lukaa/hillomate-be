import { Model } from 'mongoose';
import { CreatePostDTO } from './dtos/create-post.dto';
import { Post, PostDocument } from './schemas/post.schema';
export declare class PostService {
    private readonly postModel;
    constructor(postModel: Model<PostDocument>);
    getAllPosts(): Promise<Post[]>;
    getPost(id: string): Promise<Post>;
    addPost(postData: CreatePostDTO): Promise<Post>;
    updatePost(id: string, updatePost: CreatePostDTO): Promise<Post>;
    deletePost(id: string): Promise<any>;
}
