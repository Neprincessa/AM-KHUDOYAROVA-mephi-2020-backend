import { Column, Entity, ManyToOne, BeforeInsert, JoinTable } from 'typeorm';
import { classToPlain } from 'class-transformer';
import { UserEntity } from '@app/user/entity/user.entity';
import { AbstractEntity } from '@app/common/entity/abstract-entity';
import slug = require('slug');

@Entity({ name: 'present' })
export class PresentEntity extends AbstractEntity {
  @Column({
    type: 'varchar',
    length: 255,
  })
  slug: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'integer',
  })
  cost: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  address: string;

  @Column({
    type: 'boolean',
  })
  state: boolean;

  @BeforeInsert()
  generateSlug() {
    this.slug =
      slug(this.name, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }

  @ManyToOne(() => UserEntity, (user) => user.presents, { eager: true })
  user: UserEntity;

  toJSON() {
    return classToPlain(this);
  }

  toPresent() {
    const present: any = this.toJSON();
    return { ...present };
  }

  // toPresent(user: UserEntity){
  //   const present: any = this.toJSON();
  //   return { ...present, };
  // }
}
