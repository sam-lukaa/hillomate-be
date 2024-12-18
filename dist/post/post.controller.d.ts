import { PostService } from './post.service';
import { CreatePostDTO } from './dtos/create-post.dto';
export declare class PostController {
    private postService;
    constructor(postService: PostService);
    getPost(id: string): Promise<import("./schemas/post.schema").Post>;
    getPosts(): Promise<import("./schemas/post.schema").Post[]>;
    createPost(createPost: CreatePostDTO): Promise<import("./schemas/post.schema").Post>;
    updatePost(id: string, updatePost: CreatePostDTO): Promise<import("./schemas/post.schema").Post>;
    deletePost(id: string): Promise<any>;
}
