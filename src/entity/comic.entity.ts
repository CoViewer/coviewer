import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinTable,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ComicTag } from './comic-tag.entity';
import { Storage } from './storage.entity';
import { Image } from './image.entity';

@Entity()
export class Comic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'simple-array' })
  @ManyToMany(() => ComicTag)
  @JoinTable()
  tag: ComicTag[];

  @Column()
  publishDate?: Date;

  @CreateDateColumn()
  uploadTime: Date;

  // 所在存储驱动器 id
  @ManyToOne(() => Storage)
  storage: number;

  // 存储的位置
  @Column()
  path: string;

  // 包含的图片，其中进行级联
  @Column({ type: 'simple-array' })
  @OneToMany(() => Image, (image) => image.comic, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  image: Image[];

  @OneToOne(() => Image)
  cover: Image;

  @Column({ default: 0 })
  view: number;

  // SQLite 不支持 array
  // 所以要在插入和更新前进行处理
  @BeforeInsert()
  @BeforeUpdate()
  beforeInsertAndUpdate(): void {
    if (this.tag) this.tag = Array.from(new Set(this.tag));
    if (this.image) this.image = Array.from(new Set(this.image));
  }
}
