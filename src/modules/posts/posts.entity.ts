import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({ length: 500 })
    title: string;

  @Column("text")
    path: string;

  @Column()
    content: string;

  @Column()
    tags: string;

  @Column()
    slug: string;
}
