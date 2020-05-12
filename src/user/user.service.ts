import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
  ) {}

  async findByUsername(
    username: string,
    user?: UserEntity
  ): Promise<UserEntity> {
    return (await this.userRepo.findOne({ where: { username } })).toProfile(
      user
    );
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
    console.log(this.findUserByUsername(username));
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
