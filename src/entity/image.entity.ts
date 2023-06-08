import {
  Entity,
  Column,
  ManyToOne,
  BeforeInsert,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comic } from './comic.entity';
import { nanoid } from 'nanoid';

// TODO: 同步删除缩略图数据
@Entity()
export class Image {
  @PrimaryColumn()
  id: string;

  @Column()
  fileName: string;

  // 所属漫画
  @ManyToOne(() => Comic, (comic) => comic.images, { cascade: true, onDelete: 'CASCADE' })
  comic: Comic;

  @Column({ unique: true })
  sha256: string;

  @BeforeInsert()
  generateIdIfNull() {
    if (!this.id) {
      this.id = nanoid();
    }
  }
}
