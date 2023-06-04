import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Temp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
  
  // 文件后缀
  @Column({ name: 'file_ext' })
  fileExt: string;

  // 文件 hash
  @Column({ unique: true })
  sha256: string;

  @CreateDateColumn({ name: 'upload_time' })
  uploadTime: Date;
}
