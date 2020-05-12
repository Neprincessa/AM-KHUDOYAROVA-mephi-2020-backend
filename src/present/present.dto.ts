import { IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';
import { PresentEntity } from './entity/present.entity';
import { UserResponse } from '@app/user/user.dto';

export class PresentDTO {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsInt()
  cost: number;

  @IsBoolean()
  state: boolean;

  public static from(dto: Partial<PresentDTO>) {
    const it = new PresentDTO();
    it.name = dto.name;
    it.address = dto.address;
    it.cost = dto.cost;
    it.state = dto.state;
    return it;
  }

  public static fromEntity(entity: PresentEntity) {
    return this.from({
      name: entity.name,
      address: entity.address,
      cost: entity.cost,
      state: entity.state,
    });
  }

  public toEntity() {
    const it = new PresentEntity();
    it.name = this.name;
    it.address = this.address;
    it.cost = this.cost;
    return it;
  }
}

export class CreatePresentDTO {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsInt()
  cost: number;

  @IsBoolean()
  state: boolean;
}

export class UpdatePresentDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsInt()
  @IsOptional()
  cost: number;

  @IsBoolean()
  @IsOptional()
  state: boolean;
}

export interface FindAllQuery {
  username: string;
}
