import { Module } from '@nestjs/common';
import { PresentController } from './present.controller';
import { PresentService } from './present.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PresentEntity } from './entity/present.entity';
import { UserEntity } from '@app/user/entity/user.entity';
import { AuthModule } from '@app/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PresentEntity, UserEntity]), AuthModule],
  controllers: [PresentController],
  providers: [PresentService],
})
export class PresentModule {}
