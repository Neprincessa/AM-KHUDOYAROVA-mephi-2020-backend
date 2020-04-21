import { IsString, IsInt, IsBoolean } from 'class-validator';
import { Present } from './entities/present.entity';

export class PresentDTO implements Readonly<PresentDTO> {
  @IsInt()
  id: string;

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
    it.id = dto.id;
    it.name = dto.name;
    it.address = dto.address;
    it.cost = dto.cost;
    it.state = dto.state;
    return it;
  }

  public static fromEntity(entity: Present) {
    return this.from({
      id: entity.id,
      name: entity.name,
      address: entity.address,
      cost: entity.cost, 
      state: entity.state,
    });
  }

  public toEntity() {
    const it = new Present();
    it.id = this.id;
    it.name = this.name;
    it.address = this.address;
    it.cost = this.cost;
    it.state = this.state;
    return it;
  }
}