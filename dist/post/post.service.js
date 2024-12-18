"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const common_1 = require("@nestjs/common");
let PostService = class PostService {
    constructor(postModel) {
        this.postModel = postModel;
    }
    async getAllPosts() {
        const posts = await this.postModel.find().exec();
        return posts;
    }
    async getPost(id) {
        try {
            const post = await this.postModel.findById(id).exec();
            if (!post) {
                throw new common_1.HttpException({
                    error: 'Post not found',
                    status: common_1.HttpStatus.NOT_FOUND,
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return post;
        }
        catch (err) {
            throw new common_1.HttpException({
                error: 'Error retrieving post',
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR, { cause: err });
        }
    }
    async addPost(postData) {
        const post = await this.postModel.create(postData);
        return post;
    }
    async updatePost(id, updatePost) {
        const post = await this.postModel
            .findByIdAndUpdate(id, updatePost, { new: true })
            .exec();
        return post;
    }
    async deletePost(id) {
        const deletedPost = await this.postModel.findByIdAndDelete(id).exec();
        return deletedPost;
    }
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Post')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], PostService);
//# sourceMappingURL=post.service.js.map