import { nanoid } from 'nanoid';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';

@Entity()
export class Temp {
  @PrimaryColumn()
  id: string;

  // 文件后缀
  @Column()
  fileExt: string;

  // 文件 hash
  @Column({ unique: true })
  sha256: string;

  @CreateDateColumn()
  uploadTime: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = nanoid();
    }
  }
}
