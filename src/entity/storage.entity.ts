import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Storage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  driver: 's3' | 'local' | 'webdav';

  @Column({ unique: true })
  name: string;

  @Column()
  addition: string;
}
