import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ComicTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  value: string;

  @Column()
  rules?: string;

  @Column()
  name: string;
}
