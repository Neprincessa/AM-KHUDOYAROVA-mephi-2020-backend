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

  @ManyToMany(() => UserEntity, (user) => user.followee)
  @JoinTable()
  followers: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.followers)
  followee: UserEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toJSON() {
    return classToPlain(this);
  }

  toProfile(user?: UserEntity) {
    let following = false;
    console.log(user);
    if (user && this.followers !== undefined) {
      following = this.followers.includes(user);
    }
    const profile: any = this.toJSON();
    delete profile.followers;
    return { ...profile, following };
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
