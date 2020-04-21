import { Column, Entity,Generated, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'present',
})
export class Present {
  @PrimaryColumn({
    type: "integer"
  })
  @Generated("increment")
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'integer',
  })
  cost: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  address: string;

  @Column({
    type: 'boolean',
  })
  state: boolean;


}
