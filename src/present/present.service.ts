import { Injectable } from '@nestjs/common';
import { Present } from './entities/present.entity';
import { PresentDTO } from './present.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class PresentService {
  constructor(@InjectRepository(Present) private readonly repo: Repository<Present>) { }

  public async getAll(): Promise<PresentDTO[]> {
    return await this.repo.find()
      .then(presents => presents.map(e => PresentDTO.fromEntity(e)));
  }

  public async create(dto: PresentDTO): Promise<PresentDTO> {
    return this.repo.save(dto);
  }
}