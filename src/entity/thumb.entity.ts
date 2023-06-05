import { Entity, Column, OneToOne, PrimaryColumn } from 'typeorm';

// TODO: 没完成外联
@Entity()
export class Thumb {
  @PrimaryColumn()
  id: string;

  // 缩略图的二进制数据
  @Column({ type: 'blob' })
  thumb: Buffer;
}
