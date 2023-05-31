import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  group: string;

  @Column()
  key: string;

  @Column()
  value: string;

  @Column()
  type: string;
}
