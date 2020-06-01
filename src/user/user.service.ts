import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from './user.dto';
import { profile } from 'winston';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
  ) {}

  async findByUsername(
    username: string,
    user?: UserEntity
  ): Promise<UserEntity> {
    const userprof = await this.userRepo.findOne({ where: { username } });
    if (!userprof) {
      throw new NotFoundException();
    }
    return userprof.toProfile(user);
  }

  async findWithFriends(
    username: string,
    user?: UserEntity
  ): Promise<UserEntity[]> {
    const tagetUser = await this.userRepo.findOne({
      relations: ['followers'],
      where: { username },
    });
    if (!tagetUser) {
      throw new NotFoundException();
    }
    const friends = tagetUser.followers;
    return friends.map((friend) => friend.toProfile(user));
  }

  async findUserByUsername(username: string) {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException();
    }
    return user.toUser();
  }

  async updateUser(username: string, data: UpdateUserDTO) {
    if (!data) {
      throw new BadRequestException();
    }
    await this.userRepo.update({ username }, data);
    return this.findUserByUsername(username);
  }

  async followUser(currentUser: UserEntity, username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['followers'],
    });
    user.followers.push(currentUser);
    await user.save();
    return user.toProfile(currentUser);
  }

  async unfollowUser(currentUser: UserEntity, username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['followers'],
    });
    user.followers = user.followers.filter(
      (follower) => follower !== currentUser
    );
    await user.save();
    return user.toProfile(currentUser);
  }
}
