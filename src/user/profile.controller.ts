import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@app/auth/user.decorator';
import { UserEntity } from './entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { OptionalAuthGuard } from '@app/auth/optional-auth.guard';

@Controller('profiles')
export class ProfileController {
  constructor(private userService: UserService) {}

  @Get('/:username')
  @UseGuards(new OptionalAuthGuard())
  async findProfile(
    @Param('username') username: string,
    @User() user?: UserEntity
  ) {
    const profile = await this.userService.findByUsername(username, user);
    if (!profile) {
      throw new NotFoundException();
    }
    return { profile };
  }

  @Get('/:username/friends')
  @UseGuards(new OptionalAuthGuard())
  async findFriends(
    @Param('username') username: string,
    @User() user?: UserEntity
  ) {
    const profiles = await this.userService.findWithFriends(username, user);
    if (!profiles) {
      throw new NotFoundException();
    }
    return { profiles, profilesCount: profiles.length };
  }

  @Post('/:username/follow')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  async followUser(
    @User() user: UserEntity,
    @Param('username') username: string
  ) {
    const profile = await this.userService.followUser(user, username);
    return { profile };
  }

  @Delete('/:username/follow')
  @UseGuards(AuthGuard())
  async unfollowUser(
    @User() user: UserEntity,
    @Param('username') username: string
  ) {
    const profile = await this.userService.unfollowUser(user, username);
    return { profile };
  }

  @Get('/find/:username')
  async findProfiles(@Param('username') username: string) {
    const profiles = await this.userService.findSameAs(username);
    if (!profiles) {
      throw new NotFoundException();
    }
    return { profiles, profilesCount: profiles.length };
  }
}
