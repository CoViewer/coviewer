import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ComicTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column()
  name: string;
}
