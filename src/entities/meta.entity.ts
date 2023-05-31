import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

class Rule {
  value: string;
  type: 'black' | 'white';
}

@Entity()
export class Meta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  password: string;

  @Column({ type: 'simple-array' })
  rule: Rule[];

  @Column()
  all: Boolean;
}
