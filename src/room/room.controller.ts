import { RoomService } from './room.service';
import {
  Get,
  Body,
  Post,
  Param,
  Controller,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  /**
   * Handles room creation or joining based on the specified action.
   *
   * - For `create`: Requires `roomName` and optional `password`. The creator is added as the admin.
   * - For `join`: Requires `roomId` and optional `password`. The user is added as a participant.
   *
   * @param action - The action to perform (`create` or `join`).
   * @param roomId - The unique identifier of the room (required for joining).
   * @param roomName - The name of the room to be created (required for creation).
   * @param password - Optional password for securing or accessing the room.
   * @returns The room details, including the user's `userId` and their role.
   * @throws HttpException if the action is invalid or missing parameters.
   */
  @Post(':action')
  async handleRoom(
    @Param('action') action: 'create' | 'join',
    @Body('roomId') roomId?: string,
    @Body('roomName') roomName?: string,
    @Body('password') password?: string,
  ) {
    if (action === 'create' && roomName) {
      return this.roomService.createRoom(roomName, password);
    }

    if (action === 'join' && roomId) {
      return this.roomService.joinRoom(roomId, password);
    }

    throw new HttpException(
      'Invalid action or missing parameters. For "create", provide roomName. For "join", provide roomId.',
      HttpStatus.BAD_REQUEST,
    );
  }

  /**
   * Removes a user from a room's members list.
   *
   * - The user is removed from the room by their `userId`.
   *
   * @param roomId - The unique identifier of the room.
   * @param userId - The unique identifier of the user leaving the room.
   * @returns The updated room details without the password field.
   * @throws HttpException if the room or user is not found.
   */
  @Post('leave/:roomId')
  async leaveRoom(
    @Body('userId') userId: string,
    @Param('roomId') roomId: string,
  ) {
    if (!roomId || !userId) {
      throw new HttpException(
        'Room ID and User ID are required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.roomService.leaveRoom(roomId, userId);
  }

  /**
   * Retrieves the details of a room by its ID, including the members and their roles.
   *
   * - The room details include a list of members and their roles (`admin` or `participant`).
   *
   * @param roomId - The unique identifier of the room.
   * @returns The room details (excluding the password field).
   * @throws HttpException if the room is not found.
   */
  @Get('/:roomId')
  async getRoom(@Param('roomId') roomId: string) {
    if (!roomId) {
      throw new HttpException('Room ID is required.', HttpStatus.BAD_REQUEST);
    }

    return this.roomService.getRoom(roomId);
  }
}
