import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({ length: 500 })
    title: string;

  @Column("text")
    path: string;

  @Column("text")
    content: string;

  @Column("text")
    tags: string;

  @Column("text")
    slug: string;
}
