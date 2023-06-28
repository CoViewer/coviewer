import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ComicTagRule } from './comic-tag-rule.entity';

@Entity()
export class ComicTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  value: string;

  // 该 rules 用于自动导入时的识别
  @ManyToMany(() => ComicTagRule, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable()
  rules?: ComicTagRule[];

  @Column()
  name: string;
}
