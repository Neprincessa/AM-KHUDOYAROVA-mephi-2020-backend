import {
  Controller,
  Get,
  UseGuards,
  Put,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@app/auth/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from './entity/user.entity';
import { UpdateUserDTO } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard())
  findCurrentUser(@User() { username }: UserEntity) {
    return this.userService.findUserByUsername(username);
  }

  @Put()
  @UseGuards(AuthGuard())
  update(
    @User() { username }: UserEntity,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: { user: UpdateUserDTO }
  ) {
    return this.userService.updateUser(username, data.user);
  }
}
