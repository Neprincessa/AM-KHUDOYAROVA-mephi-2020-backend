import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository, Like } from 'typeorm';
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
    const userprof = await this.userRepo.findOne({
      where: { username },
      relations: ['isFriend'],
    });
    if (!userprof) {
      throw new NotFoundException();
    }
    return userprof.toProfile(user);
  }

  async findWithFriends(
    usrName: string,
    user?: UserEntity
  ): Promise<UserEntity[]> {
    const tagetUser = await this.userRepo.findOne({
      relations: ['isFriend'],
      where: { username: usrName },
    });
    if (!tagetUser) {
      throw new NotFoundException();
    }
    const friends = tagetUser.isFriend;
    return friends.map((friend) => friend.toProfile());
  }

  async findUserByUsername(usrName: string) {
    const user = await this.userRepo.findOne({ where: { username: usrName } });
    if (!user) {
      throw new NotFoundException();
    }
    return user.toUser();
  }

  async updateUser(usrName: string, data: UpdateUserDTO) {
    if (!data) {
      throw new BadRequestException();
    }
    await this.userRepo.update({ username: usrName }, data);
    return this.findUserByUsername(usrName);
  }

  async followUser(currentUser: UserEntity, usrName: string) {
    const user = await this.userRepo.findOne({
      where: { username: usrName },
    });
    const thisUser = await this.userRepo.findOne({
      where: { username: currentUser.username },
      relations: ['isFriend'],
    });
    if (thisUser.isFriend.indexOf(user) === -1) {
      thisUser.isFriend.push(user);
    }
    await thisUser.save();
    return thisUser.toProfile(user);
  }

  async unfollowUser(currentUser: UserEntity, usrName: string) {
    const userToDelete = await this.userRepo.findOne({
      where: { username: usrName },
    });
    const user = await this.userRepo.findOne({
      where: { username: currentUser.username },
      relations: ['isFriend'],
    });
    user.isFriend = user.isFriend.filter(
      (friend) => friend.username !== userToDelete.username
    );
    await user.save();
    return user.toProfile(userToDelete);
  }

  async findSameAs(usrName: string): Promise<UserEntity[]> {
    const users = await this.userRepo.find({ username: Like(`%${usrName}%`) });
    if (!users) {
      throw new NotFoundException();
    }
    return users.map((user) => user.toProfile());
  }
}
