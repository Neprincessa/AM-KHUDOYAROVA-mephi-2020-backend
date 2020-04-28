import { Column, BeforeInsert, Entity } from 'typeorm';
import { IsEmail } from 'class-validator';
import { Exclude, classToPlain } from 'class-transformer';
import { AbstractEntity } from './abstract-entity';
import * as bcrypt  from 'bcryptjs';

@Entity('user')
export class UserEntity extends AbstractEntity {
    @Column()
    @IsEmail()
    email: string;

    @Column({unique: true})
    username: string;

    @Column()
    @Exclude()
    password: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    toJSON() {
        return classToPlain(this);
    }

    async comparePassword(attempt: string) {
        return await bcrypt.compare(attempt, this.password);
    }
}