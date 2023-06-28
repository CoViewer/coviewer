import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ComicTagRule {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: 'includes' | 'regex';

  @Column()
  value: string;
}
