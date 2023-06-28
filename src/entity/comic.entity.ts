import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
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

  @Column({ unique: true })
  title: string;

  @Column({ type: 'simple-array' })
  @ManyToMany(() => ComicTag, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable()
  tags: ComicTag[];

  @Column()
  publishDate?: Date;

  @CreateDateColumn()
  uploadTime: Date;

  // 所在存储驱动器 id
  @ManyToOne(() => Storage, (storage) => storage.comic)
  storage: Storage;

  // 存储的位置
  @Column()
  path: string;

  // 包含的图片，其中进行级联
  @Column({ type: 'simple-array' })
  @OneToMany(() => Image, (image) => image.comic)
  images: Image[];

  @ManyToOne(() => Image)
  cover: Image;

  @Column({ default: 0 })
  view: number;

  // SQLite 不支持 array
  // 所以要在插入和更新前进行处理
  @BeforeInsert()
  @BeforeUpdate()
  beforeInsertAndUpdate(): void {
    if (this.tags) this.tags = Array.from(new Set(this.tags));
    if (this.images) this.images = Array.from(new Set(this.images));
    if (!this.cover) this.cover = this.images[0];
    if (typeof this.publishDate != 'object')
      this.publishDate = new Date(this.publishDate);
  }
}
