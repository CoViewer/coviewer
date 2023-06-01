import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Comic } from './comic.entity';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Comic)
  comic: Comic;

  @Column()
  page: number;

  @Column({ name: 'update_time' })
  updateTime: Date;
}
