import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { News} from './entities/news.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NewsService {
  constructor(@InjectRepository(News) private readonly repo: Repository<News>) { }

  public async getAll() {
    return await this.repo.find();
  }
}