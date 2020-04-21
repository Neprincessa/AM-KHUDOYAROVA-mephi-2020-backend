import { Module } from '@nestjs/common';
import { PresentController } from './present.controller';
import { PresentService } from './present.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Present } from './entities/present.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Present])],
  controllers: [PresentController],
  providers: [PresentService]
})
export class PresentModule {}
