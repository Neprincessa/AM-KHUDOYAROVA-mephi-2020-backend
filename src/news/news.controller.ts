import { Controller, Get } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private serv: NewsService) { }

  @Get()
  public async getAll() {
    return await this.serv.getAll();
  }
}