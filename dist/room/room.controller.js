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
exports.RoomController = void 0;
const room_service_1 = require("./room.service");
const common_1 = require("@nestjs/common");
let RoomController = class RoomController {
    constructor(roomService) {
        this.roomService = roomService;
    }
    async handleRoom(action, roomId, roomName, password) {
        if (action === 'create' && roomName) {
            return this.roomService.createRoom(roomName, password);
        }
        if (action === 'join' && roomId) {
            return this.roomService.joinRoom(roomId, password);
        }
        throw new common_1.HttpException('Invalid action or missing parameters. For "create", provide roomName. For "join", provide roomId.', common_1.HttpStatus.BAD_REQUEST);
    }
    async leaveRoom(userId, roomId) {
        if (!roomId || !userId) {
            throw new common_1.HttpException('Room ID and User ID are required.', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.roomService.leaveRoom(roomId, userId);
    }
    async getRoom(roomId) {
        if (!roomId) {
            throw new common_1.HttpException('Room ID is required.', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.roomService.getRoom(roomId);
    }
};
exports.RoomController = RoomController;
__decorate([
    (0, common_1.Post)(':action'),
    __param(0, (0, common_1.Param)('action')),
    __param(1, (0, common_1.Body)('roomId')),
    __param(2, (0, common_1.Body)('roomName')),
    __param(3, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "handleRoom", null);
__decorate([
    (0, common_1.Post)('leave/:roomId'),
    __param(0, (0, common_1.Body)('userId')),
    __param(1, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "leaveRoom", null);
__decorate([
    (0, common_1.Get)('/:roomId'),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getRoom", null);
exports.RoomController = RoomController = __decorate([
    (0, common_1.Controller)('room'),
    __metadata("design:paramtypes", [room_service_1.RoomService])
], RoomController);
//# sourceMappingURL=room.controller.js.map