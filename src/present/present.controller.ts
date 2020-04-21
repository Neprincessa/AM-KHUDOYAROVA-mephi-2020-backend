import { Controller, Get, Post, Body } from '@nestjs/common';
import { PresentDTO } from './present.dto';
import { PresentService } from './present.service';

@Controller('present')
export class PresentController {
    constructor(private serv: PresentService) { }

    @Get()
    public async getAll(): Promise<PresentDTO[]> {
      return await this.serv.getAll()
    }
  
    @Post('insert')
    public async post(@Body() dto: PresentDTO): Promise<PresentDTO> {
      return this.serv.create(dto);
    }
}
