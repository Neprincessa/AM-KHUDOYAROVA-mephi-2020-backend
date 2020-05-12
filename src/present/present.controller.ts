import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  Put,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import {
  PresentDTO,
  CreatePresentDTO,
  UpdatePresentDTO,
  FindAllQuery,
} from './present.dto';
import { PresentService } from './present.service';
import { PresentEntity } from './entity/present.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@app/auth/user.decorator';
import { UserEntity } from '@app/user/entity/user.entity';
import { OptionalAuthGuard } from '@app/auth/optional-auth.guard';
import { ResponseObject } from '@app/common/response.model';

@Controller('present')
export class PresentController {
  constructor(private presentService: PresentService) {}

  @Get()
  @UseGuards(new OptionalAuthGuard())
  async findAll(
    @Query() query: FindAllQuery
  ): Promise<
    ResponseObject<'presents', PresentEntity[]> &
      ResponseObject<'presentsCount', number>
  > {
    const presents = await this.presentService.findAll(query);
    return { presents, presentsCount: presents.length };
  }

  @Get('/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const present = await this.presentService.findBySlug(slug);
    if (!present) {
      throw new NotFoundException();
    }
    return { present };
  }

  @Post()
  @UseGuards(AuthGuard())
  async createPresent(
    @User() user: UserEntity,
    @Body(ValidationPipe) data: { present: CreatePresentDTO }
  ) {
    const present = await this.presentService.createPresent(user, data.present);
    return { present };
  }

  @Put('/:slug')
  @UseGuards(AuthGuard())
  async updatePresent(
    @Param('slug') slug: string,
    @User() user: UserEntity,
    @Body(ValidationPipe) data: { present: UpdatePresentDTO }
  ) {
    const present = await this.presentService.updatePresent(
      slug,
      user,
      data.present
    );
    return { present };
  }

  @Delete('/:slug')
  @UseGuards(AuthGuard())
  async deletePresent(@Param('slug') slug: string, @User() user: UserEntity) {
    const present = await this.presentService.deletePresent(slug, user);
    return { present };
  }

  // @UseGuards(AuthGuard())
  // public async getAll(): Promise<PresentDTO[]> {
  //   return await this.service.getAllbyUser();
  // }

  // @Post('insert')
  // public async post(@Body() dto: PresentDTO): Promise<PresentDTO> {
  //   return this.service.create(dto);
  // }
}
