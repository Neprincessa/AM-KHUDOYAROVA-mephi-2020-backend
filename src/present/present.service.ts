import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PresentEntity } from './entity/present.entity';
import {
  PresentDTO,
  CreatePresentDTO,
  UpdatePresentDTO,
  FindAllQuery,
} from './present.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/entity/user.entity';

@Injectable()
export class PresentService {
  constructor(
    @InjectRepository(PresentEntity)
    private presentRepo: Repository<PresentEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>
  ) {}

  findBySlug(slug: string) {
    return this.presentRepo.findOne({ where: { slug } });
  }

  private ensureOwnership(user: UserEntity, present: PresentEntity): boolean {
    console.log(present);
    console.log(present.user);
    console.log(user);
    return present.user.id === user.id;
  }

  async findAll(query: FindAllQuery): Promise<PresentEntity[]> {
    const foundUser = await this.userRepo.findOne({
      where: { username: query.username },
    });
    if (!foundUser) {
      throw new NotFoundException();
    }
    const user = foundUser.toUser().user;
    return (await this.presentRepo.find({ where: { user } })).map((present) =>
      present.toPresent()
    );
  }

  async createPresent(user: UserEntity, data: CreatePresentDTO) {
    const present = this.presentRepo.create(data);
    present.user = user;
    const { slug } = await present.save();
    return (await this.presentRepo.findOne({ slug })).toJSON();
  }

  async updatePresent(slug: string, data: UpdatePresentDTO) {
    const present = await this.findBySlug(slug);
    if (!present) {
      throw new NotFoundException();
    }
    await this.presentRepo.update({ slug }, data);
    return (await this.presentRepo.findOne({ slug })).toJSON();
  }

  async deletePresent(slug: string, user: UserEntity) {
    const present = await this.findBySlug(slug);
    if (!this.ensureOwnership(user, present)) {
      throw new UnauthorizedException();
    }
    if (!present) {
      throw new NotFoundException();
    }
    await this.presentRepo.remove(present);
  }
}
