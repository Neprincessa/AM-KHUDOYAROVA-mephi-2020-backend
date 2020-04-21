import { IsOptional, IsUUID } from 'class-validator';

export class NewsItemDto {
  @IsOptional()
  id?: string;
}
