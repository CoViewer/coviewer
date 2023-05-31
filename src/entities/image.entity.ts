import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Comic } from './comic.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  // 所属漫画
  @ManyToOne(() => Comic)
  comic: string;

  // 缩略图的二进制数据
  // TODO: 在考虑要不要把缩略图单独数据库出来
  @Column({ type: 'blob' })
  thumb: Buffer;
}
