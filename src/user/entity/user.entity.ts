import {
  Column,
  BeforeInsert,
  Entity,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { Exclude, classToPlain } from 'class-transformer';
import { AbstractEntity } from '../../common/entity/abstract-entity';
import * as bcrypt from 'bcryptjs';
import { PresentEntity } from '@app/present/entity/present.entity';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  surname: string;

  @ManyToMany(() => UserEntity, (user) => user.isFriend)
  @JoinTable()
  friendOf: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.friendOf)
  isFriend: UserEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toJSON() {
    return classToPlain(this);
  }

  toProfile(user?: UserEntity) {
    let areFriends = false;
    console.log(this.isFriend);
    if (user && this.isFriend !== undefined) {
      areFriends = this.isFriend.indexOf(user) !== -1 ? true : false;
    }
    const profile: any = this.toJSON();
    delete profile.isFriend;
    return { ...profile, areFriends };
  }

  toUser() {
    const user: any = this.toJSON();
    return { user: { ...user } };
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  @OneToMany(() => PresentEntity, (present) => present.user)
  presents: PresentEntity[];
}
