import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@app/auth/auth.module';
import { ProfileController } from './profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
  controllers: [UserController, ProfileController],
  providers: [UserService],
})
export class UserModule {}
