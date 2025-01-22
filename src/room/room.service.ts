import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as Agora from 'agora-access-token';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './schema/room.schema';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel('Room') private readonly roomModel: Model<RoomDocument>,
  ) {}

  private agoraAppId = process.env.AGORA_APP_ID || '';
  private agoraAppCertificate = process.env.AGORA_APP_CERTIFICATE || '';

  /**
   * Generates a unique user ID for a participant.
   * @returns A unique user ID.
   */
  private generateUserId(): string {
    return `hillo-user-${uuidv4()}`;
  }

  /**
   * Generates an Agora token for a user in a room.
   *
   * @param roomId - The Agora channel name (same as roomId).
   * @param userId - The Agora user ID.
   * @param role - User role (`host` for admin or `audience` for participants).
   * @returns The Agora access token.
   */
  private generateAgoraToken(
    roomId: string,
    userId: any,
    role: string,
  ): string {
    const expirationTimeInSeconds = 3600; // 1 hour
    const privilegeExpiredTs =
      Math.floor(Date.now() / 1000) + expirationTimeInSeconds;

    const rtcRole =
      role === 'admin' ? Agora.RtcRole.PUBLISHER : Agora.RtcRole.SUBSCRIBER;

    return Agora.RtcTokenBuilder.buildTokenWithUid(
      this.agoraAppId,
      this.agoraAppCertificate,
      roomId,
      userId,
      rtcRole,
      privilegeExpiredTs,
    );
  }

  /**
   * Creates a new room with an optional password.
   * The creator is assigned the role of "admin."
   *
   * @param roomName - Name of the room.
   * @param password - Optional room password.
   * @returns The newly created room document with the creator's userId and role.
   */
  async createRoom(
    roomName: string,
    password?: string,
  ): Promise<{ room: Room; userId: string; token: string }> {
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

  /**
   * Joins an existing room if the session has not expired (30-minute limit).
   * @param roomId - Unique identifier of the room.
   * @param password - Optional password for the room.
   * @returns The room document and the generated userId if within time limit.
   * @throws HttpException if the room is not found or expired.
   */
  async joinRoom(
    roomId: string,
    password?: string,
  ): Promise<{ room: Omit<Room, 'password'>; userId: string; token: string }> {
    const room = await this.roomModel.findOne({ roomId }).exec();

    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }

    if (new Date(room.expiryTime) < new Date()) {
      throw new HttpException('Room session expired', HttpStatus.GONE);
    }

    if (room.password) {
      if (!password) {
        throw new HttpException(
          'Password is required',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const isPasswordValid = await bcrypt.compare(password, room.password);
      if (!isPasswordValid) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
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

  /**
   * Allows a user to leave a room.
   * Removes the user from the members list.
   *
   * @param roomId - Unique identifier of the room.
   * @param userId - Unique identifier of the user.
   * @returns The updated room details without the password field.
   */
  async leaveRoom(
    roomId: string,
    userId: string,
  ): Promise<Omit<Room, 'password'>> {
    const room = await this.roomModel.findOne({ roomId }).exec();

    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }

    room.members = room.members.filter((member) => member.userId !== userId);

    await room.save();

    const { password: _, ...roomWithoutPassword } = room.toObject();
    return roomWithoutPassword;
  }

  /**
   * Retrieves the details of a room by its ID, including the members and their roles.
   *
   * @param roomId - The unique identifier of the room.
   * @returns The room details including the members and their roles (excluding the password field).
   * @throws HttpException if the room is not found.
   */
  async getRoom(roomId: string): Promise<Omit<Room, 'password'>> {
    const room = await this.roomModel
      .findOne({ roomId })
      .select('-password')
      .exec();

    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }

    return room.toObject();
  }
}
