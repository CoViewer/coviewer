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
  
  // 当前文件名
  @Column({ unique: true })
  name: string;

  // 原始文件名
  @Column()
  file_name: string;

  // 文件 hash
  @Column({ unique: true })
  sha256: string;

  @CreateDateColumn()
  upload_time: Date;
}
