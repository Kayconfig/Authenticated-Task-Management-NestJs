import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  ownerId: string;

  @UpdateDateColumn()
  updateAt: string;

  @CreateDateColumn()
  createdAt: string;

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;
}
