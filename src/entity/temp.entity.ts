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

  @CreateDateColumn()
  upload_time: Date;

  // 原始文件名
  @Column()
  file_name: string;

  // 当前文件路径
  @Column()
  file_path: string;
}
