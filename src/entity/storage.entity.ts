import { StorageDriver } from 'src/manage/storage/storage.dto';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Comic } from './comic.entity';

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

  @Column({ type: 'simple-array', nullable: true })
  @OneToMany(() => Comic, (comic) => comic.storage)
  comic?: Comic[];
}
