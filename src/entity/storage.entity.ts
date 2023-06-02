import { StorageDriver } from 'src/manage/storage/storage.dto';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Storage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  driver: StorageDriver;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  connection?: string;

  @Column({ nullable: true })
  addition?: string;
}
