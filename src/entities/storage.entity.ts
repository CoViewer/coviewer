import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Storage {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    driver: 'oss' | 'local';

    @Column({ unique: true })
    name: string;

    @Column()
    addition: string;

}