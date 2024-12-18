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
exports.RoomService = void 0;
const mongoose_1 = require("mongoose");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
const Agora = require("agora-access-token");
const mongoose_2 = require("@nestjs/mongoose");
const common_1 = require("@nestjs/common");
let RoomService = class RoomService {
    constructor(roomModel) {
        this.roomModel = roomModel;
        this.agoraAppId = process.env.AGORA_APP_ID || '';
        this.agoraAppCertificate = process.env.AGORA_APP_CERTIFICATE || '';
    }
    generateUserId() {
        return `hillo-user-${(0, uuid_1.v4)()}`;
    }
    generateAgoraToken(roomId, userId, role) {
        const expirationTimeInSeconds = 3600;
        const privilegeExpiredTs = Math.floor(Date.now() / 1000) + expirationTimeInSeconds;
        const rtcRole = role === 'admin' ? Agora.RtcRole.PUBLISHER : Agora.RtcRole.SUBSCRIBER;
        return Agora.RtcTokenBuilder.buildTokenWithUid(this.agoraAppId, this.agoraAppCertificate, roomId, userId, rtcRole, privilegeExpiredTs);
    }
    async createRoom(roomName, password) {
        const roomId = `hillo-${Math.random().toString(36).substring(2, 15)}`;
        const hashedPassword = password
            ? await bcrypt.hash(password, 10)
            : undefined;
        const userId = this.generateUserId();
        const token = this.generateAgoraToken(roomId, userId, 'admin');
        const newRoom = await this.roomModel.create({
            roomId,
            roomName,
            password: hashedPassword,
            members: [{ userId, role: 'admin' }],
        });
        return { room: newRoom, userId, token };
    }
    async joinRoom(roomId, password) {
        const room = await this.roomModel.findOne({ roomId }).exec();
        if (!room) {
            throw new common_1.HttpException('Room not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (room.password && password) {
            const isPasswordValid = await bcrypt.compare(password, room.password);
            if (!isPasswordValid) {
                throw new common_1.HttpException('Invalid password', common_1.HttpStatus.UNAUTHORIZED);
            }
        }
        const userId = this.generateUserId();
        const token = this.generateAgoraToken(roomId, userId, 'participant');
        if (!room.members.find((member) => member.userId === userId)) {
            room.members.push({ userId, role: 'participant' });
            await room.save();
        }
        const { password: _, ...roomWithoutPassword } = room.toObject();
        return { room: roomWithoutPassword, userId, token };
    }
    async leaveRoom(roomId, userId) {
        const room = await this.roomModel.findOne({ roomId }).exec();
        if (!room) {
            throw new common_1.HttpException('Room not found', common_1.HttpStatus.NOT_FOUND);
        }
        room.members = room.members.filter((member) => member.userId !== userId);
        await room.save();
        const { password: _, ...roomWithoutPassword } = room.toObject();
        return roomWithoutPassword;
    }
    async getRoom(roomId) {
        const room = await this.roomModel
            .findOne({ roomId })
            .select('-password')
            .exec();
        if (!room) {
            throw new common_1.HttpException('Room not found', common_1.HttpStatus.NOT_FOUND);
        }
        return room.toObject();
    }
};
exports.RoomService = RoomService;
exports.RoomService = RoomService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Room')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], RoomService);
//# sourceMappingURL=room.service.js.map